from pydantic import BaseModel


class HealthOut(BaseModel):
    status: str
    version: str
    db_status: str
    environment: str
