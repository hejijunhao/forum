import uuid as uuid_pkg
from datetime import datetime

from sqlalchemy import text
from sqlmodel import Field, SQLModel


class UUIDMixin(SQLModel):
    """Mixin providing UUID primary key."""

    id: uuid_pkg.UUID = Field(
        default_factory=uuid_pkg.uuid4,
        primary_key=True,
        index=True,
        nullable=False,
        sa_column_kwargs={"server_default": text("gen_random_uuid()")},
    )


class TimestampMixin(SQLModel):
    """Mixin providing created_at and updated_at timestamps."""

    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        sa_column_kwargs={"server_default": text("now()")},
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        sa_column_kwargs={"server_default": text("now()")},
    )


class UserOwnedMixin(SQLModel):
    """Mixin for entities owned by a user (RLS preparation)."""

    user_id: uuid_pkg.UUID = Field(
        foreign_key="users.id",
        nullable=False,
        index=True,
    )
