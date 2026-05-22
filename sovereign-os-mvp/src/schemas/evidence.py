from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class EvidenceOut(BaseModel):
    id: str
    original_filename: str
    sha256_hash: str
    mime_type: str
    file_size_bytes: int
    ocr_status: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class EvidenceUploadOut(BaseModel):
    id: str
    sha256_hash: str
    ocr_status: str
    message: str = "File accepted. OCR processing enqueued."


class OcrExtractionOut(BaseModel):
    evidence_id: str
    extracted_text: Optional[str] = None
    confidence_score: Optional[float] = None
    ocr_status: str
    processed_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)
