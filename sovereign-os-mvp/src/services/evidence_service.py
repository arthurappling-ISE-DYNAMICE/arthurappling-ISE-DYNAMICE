"""
Service: Evidence Upload Orchestration
Purpose: Coordinates MIME validation, vault storage, DB record creation,
         and audit log entry for every file upload.
"""
import os
from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from src.utils.file_vault import save_to_vault
from src.utils.hash_utils import calculate_hash
from src.models.evidence import Evidence
from src.services.audit_service import append_audit_log


async def process_upload(
    file: UploadFile,
    work_order_id: str,
    db: AsyncSession,
) -> Evidence:
    """
    Upload pipeline:
    1. Read file content into memory (MVP — stream to disk for large files in v2)
    2. Compute SHA-256 hash
    3. Validate MIME type and save to vault
    4. Insert Evidence DB record
    5. Append FILE_UPLOADED audit log
    6. On any failure: rollback DB + delete vault file
    """
    content = await file.read()
    file_hash = calculate_hash(content)

    vault_path = None
    try:
        vault_path, mime_type = save_to_vault(content, file.filename)

        new_evidence = Evidence(
            original_filename=file.filename or "unknown",
            vault_path=vault_path,
            mime_type=mime_type,
            file_size_bytes=len(content),
            sha256_hash=file_hash,
            work_order_id=work_order_id,
        )
        db.add(new_evidence)
        await db.flush()  # Get ID without committing

        await append_audit_log(
            db=db,
            action="FILE_UPLOADED",
            target_resource_id=new_evidence.id,
            details={
                "filename": file.filename,
                "mime_type": mime_type,
                "size_bytes": len(content),
                "sha256": file_hash,
            },
        )
        await db.commit()
        await db.refresh(new_evidence)
        return new_evidence

    except Exception:
        await db.rollback()
        # Vault cleanup: remove orphaned file on DB failure
        if vault_path and os.path.exists(vault_path):
            os.remove(vault_path)
        raise
