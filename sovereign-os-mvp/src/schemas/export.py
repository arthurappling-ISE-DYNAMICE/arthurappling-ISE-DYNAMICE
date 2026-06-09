from pydantic import BaseModel


class ExportRequest(BaseModel):
    work_order_id: str


class ExportJobOut(BaseModel):
    job_id: str
    status: str
    message: str
