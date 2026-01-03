import uuid as uuid_pkg
from typing import Generic, List, Optional, Type, TypeVar

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import SQLModel

ModelType = TypeVar("ModelType", bound=SQLModel)


class BaseOperations(Generic[ModelType]):
    """Base CRUD operations for all models."""

    def __init__(self, model: Type[ModelType]):
        self.model = model

    async def get(self, db: AsyncSession, id: uuid_pkg.UUID) -> Optional[ModelType]:
        """Get a single record by ID."""
        statement = select(self.model).where(self.model.id == id)
        result = await db.execute(statement)
        return result.scalar_one_or_none()

    async def get_by_user(
        self,
        db: AsyncSession,
        user_id: uuid_pkg.UUID,
        id: uuid_pkg.UUID,
    ) -> Optional[ModelType]:
        """Get a record by ID, scoped to user."""
        statement = select(self.model).where(
            self.model.id == id,
            self.model.user_id == user_id,
        )
        result = await db.execute(statement)
        return result.scalar_one_or_none()

    async def get_multi_by_user(
        self,
        db: AsyncSession,
        user_id: uuid_pkg.UUID,
        skip: int = 0,
        limit: int = 100,
    ) -> List[ModelType]:
        """Get multiple records for a user with pagination."""
        statement = (
            select(self.model)
            .where(self.model.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .order_by(self.model.created_at.desc())
        )
        result = await db.execute(statement)
        return list(result.scalars().all())

    async def create(
        self,
        db: AsyncSession,
        obj_in: dict,
        user_id: uuid_pkg.UUID,
    ) -> ModelType:
        """Create a new record."""
        db_obj = self.model(**obj_in, user_id=user_id)
        db.add(db_obj)
        await db.flush()
        await db.refresh(db_obj)
        return db_obj

    async def update(
        self,
        db: AsyncSession,
        db_obj: ModelType,
        obj_in: dict,
    ) -> ModelType:
        """Update an existing record."""
        for field, value in obj_in.items():
            if value is not None:
                setattr(db_obj, field, value)
        db.add(db_obj)
        await db.flush()
        await db.refresh(db_obj)
        return db_obj

    async def delete(
        self,
        db: AsyncSession,
        id: uuid_pkg.UUID,
        user_id: uuid_pkg.UUID,
    ) -> bool:
        """Delete a record (scoped to user)."""
        db_obj = await self.get_by_user(db, user_id=user_id, id=id)
        if db_obj:
            await db.delete(db_obj)
            await db.flush()
            return True
        return False
