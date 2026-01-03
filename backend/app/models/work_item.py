import uuid as uuid_pkg
from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship, SQLModel

from app.models.base import TimestampMixin, UUIDMixin, UserOwnedMixin

if TYPE_CHECKING:
    from app.models.product import Product


class WorkItemBase(SQLModel):
    """Base fields for WorkItem."""

    title: Optional[str] = Field(default=None, max_length=500, index=True)
    description: Optional[str] = Field(default=None)
    type: Optional[str] = Field(default=None, max_length=50)  # e.g. feature, fix, refactor, investigation
    status: Optional[str] = Field(default=None, max_length=50, index=True)  # e.g. todo, in_progress, done
    priority: Optional[int] = Field(default=None)


class WorkItem(WorkItemBase, UUIDMixin, TimestampMixin, UserOwnedMixin, table=True):
    """Work item (task, feature, fix, investigation) within a Product."""

    __tablename__ = "work_items"

    product_id: Optional[uuid_pkg.UUID] = Field(
        default=None,
        foreign_key="products.id",
        index=True,
    )

    repository_id: Optional[uuid_pkg.UUID] = Field(
        default=None,
        foreign_key="repositories.id",
        index=True,
    )

    # Relationships
    product: Optional["Product"] = Relationship(back_populates="work_items")
