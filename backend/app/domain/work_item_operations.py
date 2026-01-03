import uuid as uuid_pkg
from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.base_operations import BaseOperations
from app.models.work_item import WorkItem


class WorkItemOperations(BaseOperations[WorkItem]):
    """CRUD operations for WorkItem model."""

    def __init__(self):
        super().__init__(WorkItem)

    async def get_by_product(
        self,
        db: AsyncSession,
        user_id: uuid_pkg.UUID,
        product_id: uuid_pkg.UUID,
        status: Optional[str] = None,
        type: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[WorkItem]:
        """Get work items for a product with optional filtering."""
        statement = select(WorkItem).where(
            WorkItem.user_id == user_id,
            WorkItem.product_id == product_id,
        )

        if status:
            statement = statement.where(WorkItem.status == status)
        if type:
            statement = statement.where(WorkItem.type == type)

        statement = (
            statement.order_by(WorkItem.created_at.desc())
            .offset(skip)
            .limit(limit)
        )

        result = await db.execute(statement)
        return list(result.scalars().all())


work_item_ops = WorkItemOperations()
