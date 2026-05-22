"""
Route Group: Audit
Purpose: Read-only access to the immutable audit chain.
Auth: X-API-Key required (global dependency).
"""
import hashlib
import json
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List

from src.db.session import get_db
from src.models.audit import AuditLog
from src.schemas.audit import AuditLogOut, AuditChainVerification

router = APIRouter(prefix="/audit", tags=["Audit"])


@router.get(
    "",
    response_model=List[AuditLogOut],
    summary="Retrieve paginated audit log entries",
)
async def list_audit_logs(
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    db: AsyncSession = Depends(get_db),
) -> List[AuditLogOut]:
    """
    Purpose: Retrieve audit log entries in chronological order for compliance review.
    Security Risks: Sensitive operational metadata — protected by API key.
    Lifecycle Role: Compliance export, chargeback defense, audit review.
    Failure Conditions: DB unavailable → 500.
    """
    result = await db.execute(
        select(AuditLog).order_by(AuditLog.id.asc()).limit(limit).offset(offset)
    )
    return result.scalars().all()


@router.get(
    "/verify",
    response_model=AuditChainVerification,
    summary="Verify the cryptographic integrity of the audit chain",
)
async def verify_audit_chain(db: AsyncSession = Depends(get_db)) -> AuditChainVerification:
    """
    Purpose: Walk the entire audit chain and verify each entry's hash.
    Security Risks: CPU-intensive for large chains — rate limit in production.
    Lifecycle Role: Tamper detection and integrity certification.
    Failure Conditions: Broken chain returns first_broken_at_id.
    """
    result = await db.execute(select(AuditLog).order_by(AuditLog.id.asc()))
    entries = result.scalars().all()

    if not entries:
        return AuditChainVerification(
            total_entries=0, chain_valid=True, message="No audit entries found."
        )

    previous_hash = "GENESIS"
    for entry in entries:
        raw = f"{entry.action}{entry.actor_id}{entry.target_resource_id}{entry.details_json}{previous_hash}"
        expected_hash = hashlib.sha256(raw.encode()).hexdigest()
        if expected_hash != entry.current_hash:
            return AuditChainVerification(
                total_entries=len(entries),
                chain_valid=False,
                first_broken_at_id=entry.id,
                message=f"CHAIN BROKEN at audit log ID {entry.id}. Possible tampering detected.",
            )
        previous_hash = entry.current_hash

    return AuditChainVerification(
        total_entries=len(entries),
        chain_valid=True,
        message="Audit chain is intact. All entries verified.",
    )
