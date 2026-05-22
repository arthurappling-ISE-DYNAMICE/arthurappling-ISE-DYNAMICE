from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from src.db.base import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class WorkOrder(Base):
    __tablename__ = "work_orders"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, nullable=False)
    status = Column(String, nullable=False, default="OPEN")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
