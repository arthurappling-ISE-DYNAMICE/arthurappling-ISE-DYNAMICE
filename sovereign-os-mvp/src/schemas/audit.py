from pydantic import BaseModel, ConfigDict
from typing import Optional, Any
from datetime import datetime


class AuditLogOut(BaseModel):
    id: int
    timestamp: datetime
    action: str
    actor_id: Optional[str] = None
    target_resource_id: Optional[str] = None
    details_json: Optional[str] = None
    previous_hash: Optional[str] = None
    current_hash: str
    model_config = ConfigDict(from_attributes=True)


class AuditChainVerification(BaseModel):
    total_entries: int
    chain_valid: bool
    first_broken_at_id: Optional[int] = None
    message: str
