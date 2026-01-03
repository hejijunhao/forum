from typing import TYPE_CHECKING, List, Optional

from sqlmodel import Field, Relationship, SQLModel

from app.models.base import TimestampMixin, UUIDMixin, UserOwnedMixin

if TYPE_CHECKING:
    from app.models.app_info import AppInfo
    from app.models.document import Document
    from app.models.repository import Repository
    from app.models.user import User
    from app.models.work_item import WorkItem


class ProductBase(SQLModel):
    """Base fields shared across Product schemas."""

    name: Optional[str] = Field(default=None, max_length=255, index=True)
    description: Optional[str] = Field(default=None, max_length=2000)
    icon: Optional[str] = Field(default=None, max_length=100)
    color: Optional[str] = Field(default=None, max_length=50)


class Product(ProductBase, UUIDMixin, TimestampMixin, UserOwnedMixin, table=True):
    """Product/App container - main organizing entity."""

    __tablename__ = "products"

    # Relationships
    user: Optional["User"] = Relationship(back_populates="products")
    repositories: List["Repository"] = Relationship(
        back_populates="product",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )
    work_items: List["WorkItem"] = Relationship(
        back_populates="product",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )
    documents: List["Document"] = Relationship(
        back_populates="product",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )
    app_info_entries: List["AppInfo"] = Relationship(
        back_populates="product",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )
