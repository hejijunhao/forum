# Backend Domain & API Implementation

> Completed: 2025-01-29

## Summary

Implemented the domain operations layer and API routes for all core models following an 80/20 approach - essential CRUD operations only, no edge cases.

---

## Domain Layer (`app/domain/`)

### Structure

```
app/domain/
├── __init__.py
├── base_operations.py      # Generic CRUD base class
├── product_operations.py
├── repository_operations.py
├── work_item_operations.py
├── document_operations.py
└── app_info_operations.py
```

### Base Operations

`BaseOperations[ModelType]` provides:
- `get(db, id)` - Get by ID
- `get_by_user(db, user_id, id)` - Get by ID scoped to user
- `get_multi_by_user(db, user_id, skip, limit)` - Paginated list
- `create(db, obj_in, user_id)` - Create record
- `update(db, db_obj, obj_in)` - Update record
- `delete(db, id, user_id)` - Delete scoped to user

### Model-Specific Operations

| Model | Additional Operations |
|-------|----------------------|
| Product | `get_with_relations()`, `get_by_name()` |
| Repository | `get_by_product()`, `get_by_github_id()` |
| WorkItem | `get_by_product(status?, type?)` |
| Document | `get_by_product(type?)` |
| AppInfo | `get_by_product(category?)`, `get_by_key()` |

### Usage Pattern

```python
from app.domain import product_ops

# All operations take db session as first arg
product = await product_ops.create(db, obj_in={...}, user_id=user.id)
products = await product_ops.get_multi_by_user(db, user_id=user.id)
```

---

## API Routes (`app/api/`)

### Structure

```
app/api/
├── __init__.py
├── deps.py           # Auth dependencies
├── router.py         # Main router aggregation
└── v1/
    ├── __init__.py
    ├── products.py
    ├── repositories.py
    ├── work_items.py
    ├── documents.py
    └── app_info.py
```

### Endpoints

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/products` | GET, POST | List/create products |
| `/api/products/{id}` | GET, PATCH, DELETE | Product CRUD |
| `/api/repositories?product_id=` | GET, POST | List/create repos |
| `/api/repositories/{id}` | GET, PATCH, DELETE | Repository CRUD |
| `/api/work?product_id=` | GET, POST | List/create work items |
| `/api/work/{id}` | GET, PATCH, DELETE | Work item CRUD |
| `/api/docs?product_id=` | GET, POST | List/create documents |
| `/api/docs/{id}` | GET, PATCH, DELETE | Document CRUD |
| `/api/app-info?product_id=` | GET, POST | List/create app info |
| `/api/app-info/{id}` | GET, PATCH, DELETE | App info CRUD |
| `/health` | GET | Health check |

### Authentication

All routes (except `/health`) require Bearer token authentication via Supabase JWT.

```python
from app.api.deps import get_current_user

@router.get("/")
async def list_items(current_user: User = Depends(get_current_user)):
    ...
```

User records are created automatically on first API call after Supabase OAuth.

### Query Parameters

- `product_id` (required for child resources) - Filter by parent product
- `skip`, `limit` - Pagination (default: 0, 100)
- `status`, `type`, `category` - Optional filters where applicable

### Response Format

All responses return JSON dicts with:
- UUIDs as strings
- Timestamps as ISO 8601 strings
- Secret values masked as `"********"` (AppInfo)

---

## Design Decisions

1. **No Pydantic schemas** - Using query params for input, dict responses for output. Keeps it simple for now; can add schemas later if needed.

2. **User scoping everywhere** - All queries filter by `user_id` to enforce data isolation (prep for RLS).

3. **Soft validation** - Minimal constraints (duplicate name check for products, duplicate key check for app_info). No strict enum validation.

4. **Eager loading** - `get_with_relations()` uses `selectinload()` to fetch product with all children in one query.

5. **Secret masking** - AppInfo entries with `is_secret=True` have values masked in API responses.

---

## Files Modified

- `app/main.py` - Added API router include
- `app/api/router.py` - Created router aggregation
- `app/api/deps.py` - Created auth dependencies
- `app/api/v1/*.py` - Created all route files
- `app/domain/*.py` - Created all operation files

---

## Next Steps

- [ ] Add Alembic migration for schema
- [ ] Add GitHub integration routes (`/api/github/repos`, `/api/github/import`)
- [ ] Add request body schemas if needed
- [ ] Add tests
