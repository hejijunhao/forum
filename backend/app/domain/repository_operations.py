import uuid as uuid_pkg
from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.base_operations import BaseOperations
from app.models.repository import Repository


class RepositoryOperations(BaseOperations[Repository]):
    """CRUD operations for Repository model."""

    def __init__(self):
        super().__init__(Repository)

    async def get_by_product(
        self,
        db: AsyncSession,
        user_id: uuid_pkg.UUID,
        product_id: uuid_pkg.UUID,
        skip: int = 0,
        limit: int = 100,
    ) -> List[Repository]:
        """Get repositories for a specific product."""
        statement = (
            select(Repository)
            .where(
                Repository.user_id == user_id,
                Repository.product_id == product_id,
            )
            .offset(skip)
            .limit(limit)
            .order_by(Repository.created_at.desc())
        )
        result = await db.execute(statement)
        return list(result.scalars().all())

    async def get_by_github_id(
        self,
        db: AsyncSession,
        user_id: uuid_pkg.UUID,
        github_id: int,
    ) -> Optional[Repository]:
        """Find a repository by GitHub ID."""
        statement = select(Repository).where(
            Repository.user_id == user_id,
            Repository.github_id == github_id,
        )
        result = await db.execute(statement)
        return result.scalar_one_or_none()


repository_ops = RepositoryOperations()
