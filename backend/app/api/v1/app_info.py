import uuid as uuid_pkg
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.database import get_db
from app.domain import app_info_ops
from app.models.user import User

router = APIRouter(prefix="/app-info", tags=["app info"])


@router.get("", response_model=List[dict])
async def list_app_info(
    product_id: uuid_pkg.UUID = Query(..., description="Filter by product"),
    category: Optional[str] = Query(None, description="Filter by category"),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List app info entries for a product."""
    entries = await app_info_ops.get_by_product(
        db,
        user_id=current_user.id,
        product_id=product_id,
        category=category,
        skip=skip,
        limit=limit,
    )
    return [
        {
            "id": str(e.id),
            "key": e.key,
            "value": "********" if e.is_secret else e.value,
            "category": e.category,
            "is_secret": e.is_secret,
            "description": e.description,
            "product_id": str(e.product_id) if e.product_id else None,
            "created_at": e.created_at.isoformat(),
            "updated_at": e.updated_at.isoformat(),
        }
        for e in entries
    ]


@router.get("/{app_info_id}")
async def get_app_info(
    app_info_id: uuid_pkg.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a single app info entry."""
    entry = await app_info_ops.get_by_user(db, user_id=current_user.id, id=app_info_id)
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="App info not found",
        )
    return {
        "id": str(entry.id),
        "key": entry.key,
        "value": "********" if entry.is_secret else entry.value,
        "category": entry.category,
        "is_secret": entry.is_secret,
        "description": entry.description,
        "product_id": str(entry.product_id) if entry.product_id else None,
        "created_at": entry.created_at.isoformat(),
        "updated_at": entry.updated_at.isoformat(),
    }


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_app_info(
    product_id: uuid_pkg.UUID,
    key: str,
    value: str,
    category: Optional[str] = None,
    is_secret: Optional[bool] = False,
    description: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new app info entry."""
    # Check for duplicate key in product
    existing = await app_info_ops.get_by_key(
        db, user_id=current_user.id, product_id=product_id, key=key
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="App info with this key already exists for this product",
        )

    entry = await app_info_ops.create(
        db,
        obj_in={
            "product_id": product_id,
            "key": key,
            "value": value,
            "category": category,
            "is_secret": is_secret,
            "description": description,
        },
        user_id=current_user.id,
    )
    return {
        "id": str(entry.id),
        "key": entry.key,
        "value": "********" if entry.is_secret else entry.value,
        "category": entry.category,
        "is_secret": entry.is_secret,
        "description": entry.description,
        "product_id": str(entry.product_id) if entry.product_id else None,
        "created_at": entry.created_at.isoformat(),
        "updated_at": entry.updated_at.isoformat(),
    }


@router.patch("/{app_info_id}")
async def update_app_info(
    app_info_id: uuid_pkg.UUID,
    key: Optional[str] = None,
    value: Optional[str] = None,
    category: Optional[str] = None,
    is_secret: Optional[bool] = None,
    description: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update an app info entry."""
    entry = await app_info_ops.get_by_user(db, user_id=current_user.id, id=app_info_id)
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="App info not found",
        )

    update_data = {}
    if key is not None:
        update_data["key"] = key
    if value is not None:
        update_data["value"] = value
    if category is not None:
        update_data["category"] = category
    if is_secret is not None:
        update_data["is_secret"] = is_secret
    if description is not None:
        update_data["description"] = description

    updated = await app_info_ops.update(db, db_obj=entry, obj_in=update_data)
    return {
        "id": str(updated.id),
        "key": updated.key,
        "value": "********" if updated.is_secret else updated.value,
        "category": updated.category,
        "is_secret": updated.is_secret,
        "description": updated.description,
        "product_id": str(updated.product_id) if updated.product_id else None,
        "created_at": updated.created_at.isoformat(),
        "updated_at": updated.updated_at.isoformat(),
    }


@router.delete("/{app_info_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_app_info(
    app_info_id: uuid_pkg.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete an app info entry."""
    deleted = await app_info_ops.delete(db, id=app_info_id, user_id=current_user.id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="App info not found",
        )
