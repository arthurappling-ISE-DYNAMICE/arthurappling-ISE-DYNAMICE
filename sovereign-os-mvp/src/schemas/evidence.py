from pydantic import BaseModel
from typing import Optional

class EvidenceOut(BaseModel):
    id: str
    original_filename: str
    sha256_hash: str
    mime_type: str
    file_size_bytes: int
    ocr_status: str

    class Config:
        from_attributes = True
