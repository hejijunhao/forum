import uuid as uuid_pkg
from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship, SQLModel

from app.models.base import TimestampMixin, UUIDMixin, UserOwnedMixin

if TYPE_CHECKING:
    from app.models.product import Product


class DocumentBase(SQLModel):
    """Base fields for Document."""

    title: Optional[str] = Field(default=None, max_length=500, index=True)
    content: Optional[str] = Field(default=None)
    type: Optional[str] = Field(default=None, max_length=50)  # e.g. blueprint, architecture, note, plan
    is_pinned: Optional[bool] = Field(default=False)


class Document(DocumentBase, UUIDMixin, TimestampMixin, UserOwnedMixin, table=True):
    """Documentation entry within a Product."""

    __tablename__ = "documents"

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
    product: Optional["Product"] = Relationship(back_populates="documents")
