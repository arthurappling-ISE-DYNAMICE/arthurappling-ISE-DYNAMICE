from fastapi import BackgroundTasks
from src.services.ocr_service import run_tesseract
from src.services.audit_service import append_audit_log

async def enqueue_ocr_task(
    evidence_id: str,
    vault_path: str,
    background_tasks: BackgroundTasks,
    db
):
    """Enqueue an OCR processing task as a FastAPI background task."""
    background_tasks.add_task(
        _process_ocr,
        evidence_id=evidence_id,
        vault_path=vault_path,
        db=db
    )

async def _process_ocr(evidence_id: str, vault_path: str, db):
    try:
        text = run_tesseract(vault_path)
        await append_audit_log(
            db=db,
            action="OCR_COMPLETED",
            target_resource_id=evidence_id,
            details={"chars_extracted": len(text)}
        )
    except Exception as e:
        await append_audit_log(
            db=db,
            action="OCR_FAILED",
            target_resource_id=evidence_id,
            details={"error": str(e)}
        )
