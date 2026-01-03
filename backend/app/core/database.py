from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel

from app.config import settings

engine = create_async_engine(
    settings.database_url,
    echo=settings.debug,
    future=True,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,
)

async_session_maker = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency that yields an async database session."""
    async with async_session_maker() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


async def init_db() -> None:
    """Create all tables (for development only - use Alembic in production)."""
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
