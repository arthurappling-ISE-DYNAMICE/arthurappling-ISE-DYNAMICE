import hashlib
import json
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from src.models.audit import AuditLog

async def append_audit_log(
    db: AsyncSession,
    action: str,
    actor_id: str = None,
    target_resource_id: str = None,
    details: dict = None
):
    """Append an immutable, cryptographically chained audit log entry."""
    # Get last entry hash
    result = await db.execute(select(AuditLog).order_by(AuditLog.id.desc()).limit(1))
    last_entry = result.scalar_one_or_none()
    previous_hash = last_entry.current_hash if last_entry else "GENESIS"

    details_json = json.dumps(details or {})
    raw = f"{action}{actor_id}{target_resource_id}{details_json}{previous_hash}"
    current_hash = hashlib.sha256(raw.encode()).hexdigest()

    log = AuditLog(
        action=action,
        actor_id=actor_id,
        target_resource_id=target_resource_id,
        details_json=details_json,
        previous_hash=previous_hash,
        current_hash=current_hash
    )
    db.add(log)
    await db.commit()
    return log
