import uuid as uuid_pkg
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.database import get_db
from app.domain import work_item_ops
from app.models.user import User

router = APIRouter(prefix="/work", tags=["work items"])


@router.get("", response_model=List[dict])
async def list_work_items(
    product_id: uuid_pkg.UUID = Query(..., description="Filter by product"),
    status: Optional[str] = Query(None, description="Filter by status"),
    type: Optional[str] = Query(None, description="Filter by type"),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List work items for a product."""
    items = await work_item_ops.get_by_product(
        db,
        user_id=current_user.id,
        product_id=product_id,
        status=status,
        type=type,
        skip=skip,
        limit=limit,
    )
    return [
        {
            "id": str(w.id),
            "title": w.title,
            "description": w.description,
            "type": w.type,
            "status": w.status,
            "priority": w.priority,
            "product_id": str(w.product_id) if w.product_id else None,
            "repository_id": str(w.repository_id) if w.repository_id else None,
            "created_at": w.created_at.isoformat(),
            "updated_at": w.updated_at.isoformat(),
        }
        for w in items
    ]


@router.get("/{work_item_id}")
async def get_work_item(
    work_item_id: uuid_pkg.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a single work item."""
    item = await work_item_ops.get_by_user(db, user_id=current_user.id, id=work_item_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Work item not found",
        )
    return {
        "id": str(item.id),
        "title": item.title,
        "description": item.description,
        "type": item.type,
        "status": item.status,
        "priority": item.priority,
        "product_id": str(item.product_id) if item.product_id else None,
        "repository_id": str(item.repository_id) if item.repository_id else None,
        "created_at": item.created_at.isoformat(),
        "updated_at": item.updated_at.isoformat(),
    }


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_work_item(
    product_id: uuid_pkg.UUID,
    title: str,
    description: Optional[str] = None,
    type: Optional[str] = None,
    status: Optional[str] = None,
    priority: Optional[int] = None,
    repository_id: Optional[uuid_pkg.UUID] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new work item."""
    item = await work_item_ops.create(
        db,
        obj_in={
            "product_id": product_id,
            "title": title,
            "description": description,
            "type": type,
            "status": status,
            "priority": priority,
            "repository_id": repository_id,
        },
        user_id=current_user.id,
    )
    return {
        "id": str(item.id),
        "title": item.title,
        "description": item.description,
        "type": item.type,
        "status": item.status,
        "priority": item.priority,
        "product_id": str(item.product_id) if item.product_id else None,
        "repository_id": str(item.repository_id) if item.repository_id else None,
        "created_at": item.created_at.isoformat(),
        "updated_at": item.updated_at.isoformat(),
    }


@router.patch("/{work_item_id}")
async def update_work_item(
    work_item_id: uuid_pkg.UUID,
    title: Optional[str] = None,
    description: Optional[str] = None,
    type: Optional[str] = None,
    status: Optional[str] = None,
    priority: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update a work item."""
    item = await work_item_ops.get_by_user(db, user_id=current_user.id, id=work_item_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Work item not found",
        )

    update_data = {}
    if title is not None:
        update_data["title"] = title
    if description is not None:
        update_data["description"] = description
    if type is not None:
        update_data["type"] = type
    if status is not None:
        update_data["status"] = status
    if priority is not None:
        update_data["priority"] = priority

    updated = await work_item_ops.update(db, db_obj=item, obj_in=update_data)
    return {
        "id": str(updated.id),
        "title": updated.title,
        "description": updated.description,
        "type": updated.type,
        "status": updated.status,
        "priority": updated.priority,
        "product_id": str(updated.product_id) if updated.product_id else None,
        "repository_id": str(updated.repository_id) if updated.repository_id else None,
        "created_at": updated.created_at.isoformat(),
        "updated_at": updated.updated_at.isoformat(),
    }


@router.delete("/{work_item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_work_item(
    work_item_id: uuid_pkg.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a work item."""
    deleted = await work_item_ops.delete(db, id=work_item_id, user_id=current_user.id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Work item not found",
        )
