"""
Route Group: Evidence
Purpose: Hardened file ingestion, retrieval, and OCR status polling.
Auth: X-API-Key required (global dependency).
"""
import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, BackgroundTasks, status
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from src.db.session import get_db
from src.models.evidence import Evidence
from src.models.ocr_extraction import OcrExtraction
from src.schemas.evidence import EvidenceOut, EvidenceUploadOut, OcrExtractionOut
from src.services.evidence_service import process_upload
from src.services.audit_service import append_audit_log
from src.workers.ocr_queue import enqueue_ocr_task

router = APIRouter(prefix="/evidence", tags=["Evidence"])

MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024  # 50MB


@router.post(
    "/upload",
    response_model=EvidenceUploadOut,
    status_code=status.HTTP_202_ACCEPTED,
    summary="Upload a file for evidence processing",
    description=(
        "Accepts PDF, PNG, or JPEG. Validates MIME type on raw bytes. "
        "Stores in local vault with UUID filename. Enqueues async OCR. "
        "Returns 409 if file hash already exists."
    ),
)
async def upload_evidence(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    work_order_id: str = Form(...),
    db: AsyncSession = Depends(get_db),
) -> EvidenceUploadOut:
    """
    Purpose: Core file ingestion endpoint. The most security-critical route.
    Security Risks: CRITICAL — malicious uploads, path traversal, DoS.
    Lifecycle Role: Triggers vault storage, DB record, and OCR queue.
    Failure Conditions: MIME invalid (400), hash conflict (409), vault write fail (500).
    Rollback Behavior: On DB failure, vault file is deleted before raising.
    """
    # Guard: file size pre-check via Content-Length if available
    if file.size and file.size > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum size of {MAX_FILE_SIZE_BYTES // (1024*1024)}MB.",
        )

    try:
        evidence_record = await process_upload(file=file, work_order_id=work_order_id, db=db)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except IntegrityError:
        raise HTTPException(
            status_code=409,
            detail="A file with this SHA-256 hash already exists in the system.",
        )

    # Enqueue OCR as a background task — non-blocking
    await enqueue_ocr_task(
        evidence_id=evidence_record.id,
        vault_path=evidence_record.vault_path,
        background_tasks=background_tasks,
        db=db,
    )

    return EvidenceUploadOut(
        id=evidence_record.id,
        sha256_hash=evidence_record.sha256_hash,
        ocr_status=evidence_record.ocr_status,
    )


@router.get(
    "/{evidence_id}",
    response_model=EvidenceOut,
    summary="Get evidence metadata",
)
async def get_evidence(
    evidence_id: str,
    db: AsyncSession = Depends(get_db),
) -> EvidenceOut:
    """
    Purpose: Retrieve file metadata for a specific evidence record.
    Security Risks: Never return vault_path in response.
    Failure Conditions: ID not found → 404.
    """
    result = await db.execute(select(Evidence).where(Evidence.id == evidence_id))
    ev = result.scalar_one_or_none()
    if not ev:
        raise HTTPException(status_code=404, detail="Evidence not found.")
    return ev


@router.get(
    "/{evidence_id}/ocr",
    response_model=OcrExtractionOut,
    summary="Get OCR extraction result",
)
async def get_ocr_result(
    evidence_id: str,
    db: AsyncSession = Depends(get_db),
) -> OcrExtractionOut:
    """
    Purpose: Poll for OCR processing status and retrieve extracted text.
    Lifecycle Role: Client polls this endpoint after upload until status is COMPLETED or FAILED.
    Failure Conditions: Evidence not found → 404. OCR not yet run → returns PENDING status.
    """
    ev_result = await db.execute(select(Evidence).where(Evidence.id == evidence_id))
    ev = ev_result.scalar_one_or_none()
    if not ev:
        raise HTTPException(status_code=404, detail="Evidence not found.")

    ocr_result = await db.execute(
        select(OcrExtraction).where(OcrExtraction.evidence_id == evidence_id)
    )
    ocr = ocr_result.scalar_one_or_none()

    if not ocr:
        return OcrExtractionOut(evidence_id=evidence_id, ocr_status=ev.ocr_status)

    return OcrExtractionOut(
        evidence_id=evidence_id,
        extracted_text=ocr.extracted_text,
        confidence_score=ocr.confidence_score,
        ocr_status=ev.ocr_status,
        processed_at=ocr.processed_at,
    )


@router.get(
    "/{evidence_id}/download",
    summary="Download original vault file",
    response_class=FileResponse,
)
async def download_evidence(
    evidence_id: str,
    db: AsyncSession = Depends(get_db),
):
    """
    Purpose: Serve the original file from the vault.
    Security Risks: Path traversal — vault_path is NEVER derived from user input.
                    It is always read from the DB record.
    Failure Conditions: File missing from vault (vault/DB desync) → 404.
    """
    result = await db.execute(select(Evidence).where(Evidence.id == evidence_id))
    ev = result.scalar_one_or_none()
    if not ev:
        raise HTTPException(status_code=404, detail="Evidence not found.")

    if not os.path.exists(ev.vault_path):
        raise HTTPException(status_code=404, detail="Vault file not found. Possible integrity issue.")

    return FileResponse(
        path=ev.vault_path,
        media_type=ev.mime_type,
        filename=ev.original_filename,
    )
