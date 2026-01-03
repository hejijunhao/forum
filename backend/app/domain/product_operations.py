import uuid as uuid_pkg
from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.domain.base_operations import BaseOperations
from app.models.product import Product


class ProductOperations(BaseOperations[Product]):
    """CRUD operations for Product model."""

    def __init__(self):
        super().__init__(Product)

    async def get_with_relations(
        self,
        db: AsyncSession,
        user_id: uuid_pkg.UUID,
        id: uuid_pkg.UUID,
    ) -> Optional[Product]:
        """Get product with all related entities."""
        statement = (
            select(Product)
            .where(Product.id == id, Product.user_id == user_id)
            .options(
                selectinload(Product.repositories),
                selectinload(Product.work_items),
                selectinload(Product.documents),
                selectinload(Product.app_info_entries),
            )
        )
        result = await db.execute(statement)
        return result.scalar_one_or_none()

    async def get_by_name(
        self,
        db: AsyncSession,
        user_id: uuid_pkg.UUID,
        name: str,
    ) -> Optional[Product]:
        """Find a product by name for a user."""
        statement = select(Product).where(
            Product.user_id == user_id,
            Product.name == name,
        )
        result = await db.execute(statement)
        return result.scalar_one_or_none()


product_ops = ProductOperations()
