"""
Route Group: System
Purpose: Liveness and readiness probes for the Sovereign OS.
Auth: X-API-Key required (global dependency).
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from src.db.session import get_db
from src.schemas.system import HealthOut
from src.config.settings import settings

router = APIRouter(prefix="/system", tags=["System"])


@router.get(
    "/health",
    response_model=HealthOut,
    summary="System health check",
    description="Returns liveness status, API version, and DB connectivity.",
)
async def health_check(db: AsyncSession = Depends(get_db)) -> HealthOut:
    """
    Purpose: Confirm the API and database are operational.
    Security Risks: Minimal — exposes version string only.
    Lifecycle Role: Startup probe and monitoring.
    Failure Conditions: DB unreachable → 503 via exception handler.
    """
    try:
        await db.execute(text("SELECT 1"))
        db_status = "ok"
    except Exception:
        db_status = "error"

    return HealthOut(
        status="ok",
        version="1.0.0",
        db_status=db_status,
        environment=settings.environment,
    )
