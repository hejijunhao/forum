import uuid as uuid_pkg
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.database import get_db
from app.domain import product_ops
from app.models.product import Product
from app.models.user import User

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=List[dict])
async def list_products(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all products for the current user."""
    products = await product_ops.get_multi_by_user(
        db, user_id=current_user.id, skip=skip, limit=limit
    )
    return [
        {
            "id": str(p.id),
            "name": p.name,
            "description": p.description,
            "icon": p.icon,
            "color": p.color,
            "created_at": p.created_at.isoformat(),
            "updated_at": p.updated_at.isoformat(),
        }
        for p in products
    ]


@router.get("/{product_id}")
async def get_product(
    product_id: uuid_pkg.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a single product with all related entities."""
    product = await product_ops.get_with_relations(
        db, user_id=current_user.id, id=product_id
    )
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )
    return {
        "id": str(product.id),
        "name": product.name,
        "description": product.description,
        "icon": product.icon,
        "color": product.color,
        "created_at": product.created_at.isoformat(),
        "updated_at": product.updated_at.isoformat(),
        "repositories_count": len(product.repositories),
        "work_items_count": len(product.work_items),
        "documents_count": len(product.documents),
    }


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_product(
    name: str,
    description: Optional[str] = None,
    icon: Optional[str] = None,
    color: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new product."""
    # Check for duplicate name
    existing = await product_ops.get_by_name(db, user_id=current_user.id, name=name)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product with this name already exists",
        )

    product = await product_ops.create(
        db,
        obj_in={"name": name, "description": description, "icon": icon, "color": color},
        user_id=current_user.id,
    )
    return {
        "id": str(product.id),
        "name": product.name,
        "description": product.description,
        "icon": product.icon,
        "color": product.color,
        "created_at": product.created_at.isoformat(),
        "updated_at": product.updated_at.isoformat(),
    }


@router.patch("/{product_id}")
async def update_product(
    product_id: uuid_pkg.UUID,
    name: Optional[str] = None,
    description: Optional[str] = None,
    icon: Optional[str] = None,
    color: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update a product."""
    product = await product_ops.get_by_user(db, user_id=current_user.id, id=product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    update_data = {}
    if name is not None:
        update_data["name"] = name
    if description is not None:
        update_data["description"] = description
    if icon is not None:
        update_data["icon"] = icon
    if color is not None:
        update_data["color"] = color

    updated = await product_ops.update(db, db_obj=product, obj_in=update_data)
    return {
        "id": str(updated.id),
        "name": updated.name,
        "description": updated.description,
        "icon": updated.icon,
        "color": updated.color,
        "created_at": updated.created_at.isoformat(),
        "updated_at": updated.updated_at.isoformat(),
    }


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: uuid_pkg.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a product and all related entities."""
    deleted = await product_ops.delete(db, id=product_id, user_id=current_user.id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )
