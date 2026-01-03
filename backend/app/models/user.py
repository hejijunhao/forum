import uuid as uuid_pkg
from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import text
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.product import Product


class User(SQLModel, table=True):
    """
    User model - mirrors Supabase auth.users.

    The id comes from Supabase Auth. User records are created
    on first API call after OAuth authentication.
    """

    __tablename__ = "users"

    id: uuid_pkg.UUID = Field(
        primary_key=True,
        index=True,
        nullable=False,
        description="UUID from Supabase auth.users",
    )
    email: Optional[str] = Field(default=None, max_length=255)
    github_username: Optional[str] = Field(default=None, max_length=255, index=True)
    avatar_url: Optional[str] = Field(default=None, max_length=500)
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        sa_column_kwargs={"server_default": text("now()")},
    )

    # Relationships
    products: List["Product"] = Relationship(back_populates="user")
