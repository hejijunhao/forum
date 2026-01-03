import uuid as uuid_pkg
from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship, SQLModel

from app.models.base import TimestampMixin, UUIDMixin, UserOwnedMixin

if TYPE_CHECKING:
    from app.models.product import Product


class AppInfoBase(SQLModel):
    """Base fields for AppInfo key-value store."""

    key: Optional[str] = Field(default=None, max_length=255, index=True)
    value: Optional[str] = Field(default=None)
    category: Optional[str] = Field(default=None, max_length=50)  # e.g. env_var, url, credential, note
    is_secret: Optional[bool] = Field(default=False)
    description: Optional[str] = Field(default=None, max_length=500)


class AppInfo(AppInfoBase, UUIDMixin, TimestampMixin, UserOwnedMixin, table=True):
    """Key-value store for project context (env vars, URLs, notes)."""

    __tablename__ = "app_info"

    product_id: Optional[uuid_pkg.UUID] = Field(
        default=None,
        foreign_key="products.id",
        index=True,
    )

    # Relationships
    product: Optional["Product"] = Relationship(back_populates="app_info_entries")
