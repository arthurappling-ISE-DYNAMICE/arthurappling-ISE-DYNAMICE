from sqlalchemy import Column, String, Integer, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from src.db.base import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, server_default=func.now(), nullable=False)
    action = Column(String, nullable=False)
    actor_id = Column(String, nullable=True)
    target_resource_id = Column(String, nullable=True)
    details_json = Column(Text, nullable=True)
    previous_hash = Column(String, nullable=True)
    current_hash = Column(String, nullable=False)
