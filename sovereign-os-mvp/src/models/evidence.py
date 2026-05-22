from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.sql import func
from src.db.base import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class Evidence(Base):
    __tablename__ = "evidence"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    original_filename = Column(String, nullable=False)
    vault_path = Column(String, nullable=False, unique=True)
    mime_type = Column(String, nullable=False)
    file_size_bytes = Column(Integer, nullable=False)
    sha256_hash = Column(String, nullable=False, unique=True, index=True)
    ocr_status = Column(String, default="PENDING")
    created_at = Column(DateTime, server_default=func.now())
