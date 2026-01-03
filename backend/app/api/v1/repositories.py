import uuid as uuid_pkg
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.database import get_db
from app.domain import repository_ops
from app.models.user import User

router = APIRouter(prefix="/repositories", tags=["repositories"])


@router.get("", response_model=List[dict])
async def list_repositories(
    product_id: uuid_pkg.UUID = Query(..., description="Filter by product"),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List repositories for a product."""
    repos = await repository_ops.get_by_product(
        db,
        user_id=current_user.id,
        product_id=product_id,
        skip=skip,
        limit=limit,
    )
    return [
        {
            "id": str(r.id),
            "name": r.name,
            "full_name": r.full_name,
            "description": r.description,
            "url": r.url,
            "default_branch": r.default_branch,
            "is_private": r.is_private,
            "language": r.language,
            "github_id": r.github_id,
            "stars_count": r.stars_count,
            "forks_count": r.forks_count,
            "product_id": str(r.product_id) if r.product_id else None,
            "created_at": r.created_at.isoformat(),
            "updated_at": r.updated_at.isoformat(),
        }
        for r in repos
    ]


@router.get("/{repository_id}")
async def get_repository(
    repository_id: uuid_pkg.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a single repository."""
    repo = await repository_ops.get_by_user(db, user_id=current_user.id, id=repository_id)
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Repository not found",
        )
    return {
        "id": str(repo.id),
        "name": repo.name,
        "full_name": repo.full_name,
        "description": repo.description,
        "url": repo.url,
        "default_branch": repo.default_branch,
        "is_private": repo.is_private,
        "language": repo.language,
        "github_id": repo.github_id,
        "stars_count": repo.stars_count,
        "forks_count": repo.forks_count,
        "product_id": str(repo.product_id) if repo.product_id else None,
        "created_at": repo.created_at.isoformat(),
        "updated_at": repo.updated_at.isoformat(),
    }


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_repository(
    product_id: uuid_pkg.UUID,
    name: str,
    full_name: Optional[str] = None,
    description: Optional[str] = None,
    url: Optional[str] = None,
    default_branch: Optional[str] = None,
    is_private: Optional[bool] = False,
    language: Optional[str] = None,
    github_id: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new repository."""
    repo = await repository_ops.create(
        db,
        obj_in={
            "product_id": product_id,
            "name": name,
            "full_name": full_name or name,
            "description": description,
            "url": url,
            "default_branch": default_branch,
            "is_private": is_private,
            "language": language,
            "github_id": github_id,
        },
        user_id=current_user.id,
    )
    return {
        "id": str(repo.id),
        "name": repo.name,
        "full_name": repo.full_name,
        "description": repo.description,
        "url": repo.url,
        "product_id": str(repo.product_id) if repo.product_id else None,
        "created_at": repo.created_at.isoformat(),
        "updated_at": repo.updated_at.isoformat(),
    }


@router.patch("/{repository_id}")
async def update_repository(
    repository_id: uuid_pkg.UUID,
    name: Optional[str] = None,
    description: Optional[str] = None,
    url: Optional[str] = None,
    default_branch: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update a repository."""
    repo = await repository_ops.get_by_user(db, user_id=current_user.id, id=repository_id)
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Repository not found",
        )

    update_data = {}
    if name is not None:
        update_data["name"] = name
    if description is not None:
        update_data["description"] = description
    if url is not None:
        update_data["url"] = url
    if default_branch is not None:
        update_data["default_branch"] = default_branch

    updated = await repository_ops.update(db, db_obj=repo, obj_in=update_data)
    return {
        "id": str(updated.id),
        "name": updated.name,
        "full_name": updated.full_name,
        "description": updated.description,
        "url": updated.url,
        "product_id": str(updated.product_id) if updated.product_id else None,
        "created_at": updated.created_at.isoformat(),
        "updated_at": updated.updated_at.isoformat(),
    }


@router.delete("/{repository_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_repository(
    repository_id: uuid_pkg.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a repository."""
    deleted = await repository_ops.delete(db, id=repository_id, user_id=current_user.id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Repository not found",
        )
