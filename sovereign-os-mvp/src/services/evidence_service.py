from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from src.utils.file_vault import save_to_vault
from src.utils.hash_utils import calculate_hash
from src.models.evidence import Evidence

async def process_upload(file: UploadFile, db: AsyncSession):
    # 1. Read file into memory (assume small enough for MVP, or stream)
    content = await file.read()
    
    # 2. Hash it
    file_hash = calculate_hash(content)
    
    # 3. Check if exists (omitted for brevity, would query DB here)
    
    # 4. Save to vault securely
    vault_path, mime_type = save_to_vault(content, file.filename)
    
    # 5. Create DB record
    new_evidence = Evidence(
        original_filename=file.filename,
        vault_path=vault_path,
        mime_type=mime_type,
        file_size_bytes=len(content),
        sha256_hash=file_hash
    )
    db.add(new_evidence)
    await db.commit()
    await db.refresh(new_evidence)
    
    return {"id": new_evidence.id, "hash": file_hash}
