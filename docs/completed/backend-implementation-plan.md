# Forum Backend Data Layer - Implementation Plan

> Technical implementation guide for the FastAPI backend with SQLModel and Supabase Postgres.
> See `blueprint-v1.md` for architectural decisions and `vision.md` for product philosophy.

---

## Overview

This plan details the implementation of the backend data layer using:
- **FastAPI** - Async Python web framework
- **SQLModel** - ORM combining SQLAlchemy + Pydantic
- **Supabase Postgres** - Database with RLS-ready design

Architecture follows a three-layer pattern: **API Routes → Services → Models**

---

## 1. Project Structure

```
/backend
├── alembic/                          # Database migrations
│   ├── versions/
│   ├── env.py
│   └── alembic.ini
├── app/
│   ├── __init__.py
│   ├── main.py                       # FastAPI entry point
│   ├── config.py                     # Settings/configuration
│   │
│   ├── core/                         # Infrastructure
│   │   ├── __init__.py
│   │   ├── database.py               # Async engine, session factory
│   │   ├── dependencies.py           # Shared dependencies
│   │   └── exceptions.py             # Custom exceptions
│   │
│   ├── models/                       # SQLModel table definitions
│   │   ├── __init__.py
│   │   ├── base.py                   # UUIDMixin, TimestampMixin, UserOwnedMixin
│   │   ├── user.py
│   │   ├── product.py
│   │   ├── repository.py
│   │   ├── work_item.py
│   │   ├── document.py
│   │   └── app_info.py
│   │
│   ├── schemas/                      # Pydantic request/response schemas
│   │   ├── __init__.py
│   │   ├── product.py                # ProductCreate, ProductRead, ProductUpdate
│   │   ├── repository.py
│   │   ├── work_item.py
│   │   ├── document.py
│   │   ├── app_info.py
│   │   └── github.py
│   │
│   ├── services/                     # Business logic layer
│   │   ├── __init__.py
│   │   ├── base.py                   # BaseService with generic CRUD
│   │   ├── product_service.py
│   │   ├── repository_service.py
│   │   ├── work_item_service.py
│   │   ├── document_service.py
│   │   ├── app_info_service.py
│   │   └── github_service.py
│   │
│   ├── api/                          # API routes
│   │   ├── __init__.py
│   │   ├── router.py                 # Main router aggregation
│   │   ├── deps.py                   # Auth dependencies
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── products.py
│   │       ├── repositories.py
│   │       ├── work_items.py
│   │       ├── documents.py
│   │       ├── app_info.py
│   │       └── github.py
│   │
│   └── integrations/
│       ├── __init__.py
│       └── github_client.py
│
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_api/
│   ├── test_services/
│   └── test_models/
│
├── pyproject.toml
├── .env.example
└── README.md
```

---

## 2. Database Models

### 2.1 Base Mixins

**File: `app/models/base.py`**

```python
import uuid as uuid_pkg
from datetime import datetime
from typing import Optional

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
```

### 2.2 Entity Models

| Model | Fields | Relationships |
|-------|--------|---------------|
| **User** | `id`, `email`, `github_username`, `avatar_url`, `created_at` | `products[]` |
| **Product** | `name`, `description`, `icon`, `color` + mixins | `user`, `repositories[]`, `work_items[]`, `documents[]`, `app_info_entries[]` |
| **Repository** | `name`, `full_name`, `description`, `url`, `default_branch`, `is_private`, `language`, `github_id`, `stars_count`, `forks_count`, `product_id` + mixins | `product` |
| **WorkItem** | `title`, `description`, `type` (enum), `status` (enum), `priority`, `product_id`, `repository_id?` + mixins | `product` |
| **Document** | `title`, `content`, `type` (enum), `is_pinned`, `product_id`, `repository_id?` + mixins | `product` |
| **AppInfo** | `key`, `value`, `category` (enum), `is_secret`, `description`, `product_id` + mixins | `product` |

### 2.3 Enums

```python
from enum import Enum

class WorkItemType(str, Enum):
    FEATURE = "feature"
    FIX = "fix"
    REFACTOR = "refactor"
    INVESTIGATION = "investigation"


class WorkItemStatus(str, Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done"


class DocumentType(str, Enum):
    BLUEPRINT = "blueprint"
    ARCHITECTURE = "architecture"
    NOTE = "note"
    PLAN = "plan"


class AppInfoCategory(str, Enum):
    ENV_VAR = "env_var"
    URL = "url"
    CREDENTIAL = "credential"
    NOTE = "note"
    OTHER = "other"
```

### 2.4 Indexes & Constraints

| Table | Indexes | Constraints |
|-------|---------|-------------|
| `users` | `id` (PK), `github_username` | - |
| `products` | `id` (PK), `user_id`, `name` | - |
| `repositories` | `id` (PK), `product_id`, `user_id`, `github_id`, `name` | - |
| `work_items` | `id` (PK), `product_id`, `user_id`, `status` | - |
| `documents` | `id` (PK), `product_id`, `user_id`, `title` | - |
| `app_info` | `id` (PK), `product_id`, `user_id`, `key` | `UNIQUE(product_id, key)` |

---

## 3. Domain Layer (Services)

### 3.1 Pattern: Service Layer

Using **Service pattern** for simplicity. Services encapsulate business logic and use SQLAlchemy session directly via dependency injection.

### 3.2 Base Service

**File: `app/services/base.py`**

Generic CRUD operations inherited by all entity services:

| Method | Signature | Description |
|--------|-----------|-------------|
| `get` | `(id: UUID) -> Model?` | Get by ID |
| `get_by_user` | `(user_id: UUID, id: UUID) -> Model?` | Get by ID scoped to user |
| `get_multi` | `(user_id: UUID, skip: int, limit: int) -> List[Model]` | Paginated list |
| `create` | `(obj_in: CreateSchema, user_id: UUID) -> Model` | Create new record |
| `update` | `(db_obj: Model, obj_in: UpdateSchema) -> Model` | Update existing |
| `delete` | `(id: UUID, user_id: UUID) -> bool` | Delete scoped to user |
| `count` | `(user_id: UUID) -> int` | Count user's records |

### 3.3 Entity Services

| Service | Additional Methods |
|---------|-------------------|
| `ProductService` | `get_with_children()` - eager load relationships, `get_by_name()` |
| `RepositoryService` | `get_by_product()`, `get_by_github_id()` |
| `WorkItemService` | `get_by_product(status?, type?)`, `transition_status()` |
| `DocumentService` | `get_by_product()`, `get_pinned()` |
| `AppInfoService` | `get_by_product()`, `get_by_key()` |
| `GitHubService` | `fetch_user_repos()`, `import_repositories()` |

### 3.4 Business Rules

**WorkItem Status Transitions:**

```
┌──────────┐     ┌──────────────┐     ┌──────────┐
│   TODO   │────▶│ IN_PROGRESS  │────▶│   DONE   │
└──────────┘     └──────────────┘     └──────────┘
                        │                   │
                        ▼                   │
                   ┌──────────┐             │
                   │   TODO   │◀────────────┘
                   └──────────┘
```

---

## 4. API Routes

### 4.1 Endpoint Summary

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/api/products` | `GET`, `POST` | List/create products |
| `/api/products/{id}` | `GET`, `PATCH`, `DELETE` | Product CRUD |
| `/api/repositories` | `GET`, `POST` | List/create repositories |
| `/api/repositories/{id}` | `GET`, `PATCH`, `DELETE` | Repository CRUD |
| `/api/work` | `GET`, `POST` | List/create work items |
| `/api/work/{id}` | `GET`, `PATCH`, `DELETE` | Work item CRUD |
| `/api/work/{id}/status` | `POST` | Status transition |
| `/api/docs` | `GET`, `POST` | List/create documents |
| `/api/docs/{id}` | `GET`, `PATCH`, `DELETE` | Document CRUD |
| `/api/app-info` | `GET`, `POST` | List/create app info |
| `/api/app-info/{id}` | `GET`, `PATCH`, `DELETE` | App info CRUD |
| `/api/github/repos` | `GET` | Fetch user's GitHub repos |
| `/api/github/import` | `POST` | Import repos to product |
| `/health` | `GET` | Health check |

### 4.2 Request/Response Schemas

Each entity has three schema variants:

| Schema | Purpose | Fields |
|--------|---------|--------|
| `*Create` | POST body | Required fields only |
| `*Update` | PATCH body | All fields optional |
| `*Read` | Response | All fields + `id`, `created_at`, `updated_at` |
| `*ReadFull` | Detail response | Above + nested relationships |

### 4.3 Auth Dependencies

**File: `app/api/deps.py`**

```python
async def get_current_user(credentials, db) -> User:
    """Decode Supabase JWT, validate, return/create user."""

def get_github_token(credentials) -> str:
    """Extract GitHub provider token from JWT claims."""
```

---

## 5. Implementation Details

### 5.1 SQLModel Patterns

| Pattern | Implementation |
|---------|----------------|
| Table vs Schema | Use `table=True` only on database models |
| Eager Loading | Use `selectinload()` (lazy loading fails in async) |
| Session Config | Set `expire_on_commit=False` |
| Partial Updates | Use `model_dump(exclude_unset=True)` |

### 5.2 Async Database Setup

**File: `app/core/database.py`**

```python
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

engine = create_async_engine(
    settings.database_url,
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
    async with async_session_maker() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
```

### 5.3 Supabase Integration

| Feature | Implementation |
|---------|----------------|
| JWT Verification | Decode with `supabase_jwt_secret`, algorithm HS256 |
| User Sync | Create user record on first API call if not exists |
| RLS Preparation | All tables include `user_id` foreign key |
| GitHub Token | Extract from JWT `user_metadata.provider_token` |

### 5.4 Cascade Behavior

Product deletion cascades to: `repositories`, `work_items`, `documents`, `app_info`

---

## 6. Implementation Steps

### Step 1: Project Setup
- [ ] Create `/backend` directory structure
- [ ] Set up `pyproject.toml` with dependencies
- [ ] Create `.env.example` and `config.py`
- [ ] Initialize Alembic for migrations

### Step 2: Core Infrastructure
- [ ] Implement `app/core/database.py`
- [ ] Implement `app/core/exceptions.py`
- [ ] Implement `app/models/base.py`

### Step 3: Database Models
- [ ] Implement `app/models/user.py`
- [ ] Implement `app/models/product.py`
- [ ] Implement `app/models/repository.py`
- [ ] Implement `app/models/work_item.py`
- [ ] Implement `app/models/document.py`
- [ ] Implement `app/models/app_info.py`
- [ ] Create initial Alembic migration

### Step 4: Schemas
- [ ] Implement schemas for all entities
- [ ] Implement `app/schemas/github.py`

### Step 5: Services
- [ ] Implement `app/services/base.py`
- [ ] Implement services for all entities
- [ ] Implement `app/services/github_service.py`

### Step 6: API Layer
- [ ] Implement `app/api/deps.py`
- [ ] Implement all route files in `app/api/v1/`
- [ ] Implement `app/api/router.py`
- [ ] Implement `app/main.py`

### Step 7: Integration
- [ ] Implement `app/integrations/github_client.py`
- [ ] Test OAuth flow with Supabase
- [ ] Verify all endpoints with OpenAPI docs

---

## 7. Dependencies

```toml
[tool.poetry.dependencies]
python = "^3.11"
fastapi = "^0.109.0"
sqlmodel = "^0.0.20"
asyncpg = "^0.29.0"
sqlalchemy = {extras = ["asyncio"], version = "^2.0.25"}
pydantic-settings = "^2.1.0"
python-jose = {extras = ["cryptography"], version = "^3.3.0"}
httpx = "^0.26.0"
uvicorn = {extras = ["standard"], version = "^0.27.0"}
alembic = "^1.13.0"

[tool.poetry.group.dev.dependencies]
pytest = "^7.4.0"
pytest-asyncio = "^0.23.0"
httpx = "^0.26.0"  # for TestClient
```

---

*Last updated: 2025-01-29*
