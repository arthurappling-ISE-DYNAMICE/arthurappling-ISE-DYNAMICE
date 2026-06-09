"""
Route Group: Work Orders
Purpose: Create, retrieve, update, and list work orders (cases).
Auth: X-API-Key required (global dependency).
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from typing import List

from src.db.session import get_db
from src.models.work_order import WorkOrder
from src.schemas.work_order import WorkOrderCreate, WorkOrderUpdate, WorkOrderOut, WorkOrderDetailOut
from src.services.audit_service import append_audit_log

router = APIRouter(prefix="/work-orders", tags=["Work Orders"])


@router.post(
    "",
    response_model=WorkOrderOut,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new work order",
)
async def create_work_order(
    payload: WorkOrderCreate,
    db: AsyncSession = Depends(get_db),
) -> WorkOrderOut:
    """
    Purpose: Create a new case/project container for evidence.
    Security Risks: Title field could carry XSS payloads — sanitize on render.
    Lifecycle Role: Entry point for all evidence organization.
    Failure Conditions: DB write failure → 500.
    Rollback Behavior: SQLAlchemy session rollback on exception.
    """
    work_order = WorkOrder(title=payload.title)
    db.add(work_order)
    try:
        await db.flush()
        await append_audit_log(
            db=db,
            action="WORK_ORDER_CREATED",
            target_resource_id=work_order.id,
            details={"title": payload.title},
        )
        await db.commit()
        await db.refresh(work_order)
    except Exception:
        await db.rollback()
        raise
    return work_order


@router.get(
    "",
    response_model=List[WorkOrderOut],
    summary="List all work orders",
)
async def list_work_orders(
    db: AsyncSession = Depends(get_db),
) -> List[WorkOrderOut]:
    """
    Purpose: Retrieve all work orders, ordered by creation date descending.
    Security Risks: None beyond auth.
    Lifecycle Role: Dashboard data source.
    """
    result = await db.execute(
        select(WorkOrder).order_by(WorkOrder.created_at.desc())
    )
    return result.scalars().all()


@router.get(
    "/{work_order_id}",
    response_model=WorkOrderOut,
    summary="Get a single work order",
)
async def get_work_order(
    work_order_id: str,
    db: AsyncSession = Depends(get_db),
) -> WorkOrderOut:
    """
    Purpose: Retrieve a single work order by ID.
    Failure Conditions: ID not found → 404.
    """
    result = await db.execute(
        select(WorkOrder).where(WorkOrder.id == work_order_id)
    )
    wo = result.scalar_one_or_none()
    if not wo:
        raise HTTPException(status_code=404, detail="Work order not found.")
    return wo


@router.patch(
    "/{work_order_id}",
    response_model=WorkOrderOut,
    summary="Update a work order status or title",
)
async def update_work_order(
    work_order_id: str,
    payload: WorkOrderUpdate,
    db: AsyncSession = Depends(get_db),
) -> WorkOrderOut:
    """
    Purpose: Update status (OPEN → IN_PROGRESS → CLOSED) or title.
    Lifecycle Role: Case lifecycle management.
    Rollback Behavior: Session rollback on DB failure.
    """
    result = await db.execute(
        select(WorkOrder).where(WorkOrder.id == work_order_id)
    )
    wo = result.scalar_one_or_none()
    if not wo:
        raise HTTPException(status_code=404, detail="Work order not found.")

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(wo, field, value)

    try:
        await db.flush()
        await append_audit_log(
            db=db,
            action="WORK_ORDER_UPDATED",
            target_resource_id=work_order_id,
            details=update_data,
        )
        await db.commit()
        await db.refresh(wo)
    except Exception:
        await db.rollback()
        raise
    return wo
