from sqlalchemy import Column, String, Float, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from src.db.base import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class OcrExtraction(Base):
    __tablename__ = "ocr_extractions"

    id = Column(String, primary_key=True, default=generate_uuid)
    evidence_id = Column(String, ForeignKey("evidence.id"), unique=True, nullable=False)
    extracted_text = Column(Text, nullable=True)
    confidence_score = Column(Float, nullable=True)
    processed_at = Column(DateTime, server_default=func.now())
