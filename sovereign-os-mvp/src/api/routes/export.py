"""
Route Group: Export
Purpose: Generate PDF evidence packages for work orders.
Auth: X-API-Key required (global dependency).
"""
import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from src.db.session import get_db
from src.models.work_order import WorkOrder
from src.models.evidence import Evidence
from src.schemas.export import ExportRequest
from src.services.pdf_service import generate_evidence_pdf
from src.services.audit_service import append_audit_log

router = APIRouter(prefix="/export", tags=["Export"])


@router.post(
    "/pdf",
    summary="Generate a PDF evidence package for a work order",
    response_class=FileResponse,
)
async def export_pdf(
    payload: ExportRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Purpose: Generate a formatted PDF report containing all evidence metadata
             and OCR extractions for a given work order.
    Security Risks: DoS via large work orders — consider async job pattern for scale.
    Lifecycle Role: Final deliverable for client handoff or chargeback defense.
    Failure Conditions: Work order not found (404). PDF generation failure (500).
    Rollback Behavior: Temp PDF file is deleted on failure.
    """
    wo_result = await db.execute(
        select(WorkOrder).where(WorkOrder.id == payload.work_order_id)
    )
    wo = wo_result.scalar_one_or_none()
    if not wo:
        raise HTTPException(status_code=404, detail="Work order not found.")

    ev_result = await db.execute(
        select(Evidence).where(Evidence.work_order_id == payload.work_order_id)
    )
    evidence_list = ev_result.scalars().all()

    output_path = f"/tmp/export_{uuid.uuid4().hex}.pdf"
    try:
        evidence_dicts = [
            {
                "id": e.id,
                "original_filename": e.original_filename,
                "sha256_hash": e.sha256_hash,
                "mime_type": e.mime_type,
                "file_size_bytes": e.file_size_bytes,
                "ocr_status": e.ocr_status,
            }
            for e in evidence_list
        ]
        generate_evidence_pdf(
            work_order_title=wo.title,
            evidence_list=evidence_dicts,
            output_path=output_path,
        )
    except Exception as e:
        if os.path.exists(output_path):
            os.remove(output_path)
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")

    await append_audit_log(
        db=db,
        action="PDF_EXPORTED",
        target_resource_id=payload.work_order_id,
        details={"evidence_count": len(evidence_list)},
    )
    await db.commit()

    return FileResponse(
        path=output_path,
        media_type="application/pdf",
        filename=f"prime_pathwy_evidence_{payload.work_order_id[:8]}.pdf",
    )
