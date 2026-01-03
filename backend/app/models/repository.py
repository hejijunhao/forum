import uuid as uuid_pkg
from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship, SQLModel

from app.models.base import TimestampMixin, UUIDMixin, UserOwnedMixin

if TYPE_CHECKING:
    from app.models.product import Product


class RepositoryBase(SQLModel):
    """Base fields for Repository."""

    name: Optional[str] = Field(default=None, max_length=255, index=True)
    full_name: Optional[str] = Field(default=None, max_length=500)
    description: Optional[str] = Field(default=None, max_length=2000)
    url: Optional[str] = Field(default=None, max_length=500)
    default_branch: Optional[str] = Field(default=None, max_length=100)
    is_private: Optional[bool] = Field(default=False)
    language: Optional[str] = Field(default=None, max_length=50)

    # GitHub metadata (stored at import time)
    github_id: Optional[int] = Field(default=None, index=True)
    stars_count: Optional[int] = Field(default=None)
    forks_count: Optional[int] = Field(default=None)


class Repository(RepositoryBase, UUIDMixin, TimestampMixin, UserOwnedMixin, table=True):
    """Repository linked to a Product."""

    __tablename__ = "repositories"

    product_id: Optional[uuid_pkg.UUID] = Field(
        default=None,
        foreign_key="products.id",
        index=True,
    )

    # Relationships
    product: Optional["Product"] = Relationship(back_populates="repositories")
