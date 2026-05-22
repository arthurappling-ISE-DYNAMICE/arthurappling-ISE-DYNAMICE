from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime


class WorkOrderCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255, description="Title of the work order")


class WorkOrderUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=255)
    status: Optional[str] = Field(None, pattern="^(OPEN|IN_PROGRESS|CLOSED)$")


class WorkOrderOut(BaseModel):
    id: str
    title: str
    status: str
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


class WorkOrderDetailOut(WorkOrderOut):
    evidence: List["EvidenceOut"] = []


# Avoid circular import — resolved at module level
from src.schemas.evidence import EvidenceOut  # noqa: E402
WorkOrderDetailOut.model_rebuild()
