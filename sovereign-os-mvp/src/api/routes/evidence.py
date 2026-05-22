from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.session import get_db
from src.services.evidence_service import process_upload

router = APIRouter()

@router.post("/upload")
async def upload_evidence(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    try:
        result = await process_upload(file, db)
        return {"status": "success", "data": result}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
