# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Forum is a lightweight developer workspace for managing software products and development work. It's a monorepo with a FastAPI backend and Next.js frontend.

## Development Commands

### Running Development Servers

```bash
# Both frontend and backend concurrently
npm run dev

# Individual services
npm run dev:frontend    # Next.js on :3000
npm run dev:backend     # FastAPI on :8000
```

### Backend Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
# Copy .env.example to .env and configure Supabase credentials
```

### Linting & Formatting

```bash
# All code
npm run lint
npm run format

# Backend only
cd backend && ruff check .
cd backend && ruff format .
cd backend && mypy app

# Frontend only
npm run lint:frontend
npm run format:frontend
```

### Testing

```bash
cd backend && pytest tests              # Run all tests
cd backend && pytest tests/test_x.py    # Single test file
cd backend && pytest -k "test_name"     # Run tests matching pattern
```

## Architecture

### Backend (FastAPI + SQLModel + PostgreSQL)

```
backend/app/
├── api/v1/          # Route handlers (products, repositories, work_items, documents, app_info)
├── domain/          # Business logic - generic CRUD via BaseOperations + model-specific ops
├── models/          # SQLModel entities with mixins (UUIDMixin, TimestampMixin, UserOwnedMixin)
├── core/            # Database setup (async engine, sessions) and exceptions
├── config.py        # Pydantic Settings from .env
└── main.py          # App entry point with CORS and lifespan
```

**Key patterns:**
- All queries automatically filter by `user_id` for data isolation
- Authentication via Supabase JWT in `api/deps.py` - validates token and auto-creates user on first call
- Async-first with `asyncpg` driver
- Domain layer uses `BaseOperations` generic class for CRUD, extended per model

**Data model:** Products contain Repositories, WorkItems, Documents, and AppInfo entries. All models inherit user ownership for future multi-tenancy.

### Frontend (Next.js 16 + React 19 + Tailwind 4)

```
frontend/src/app/
├── layout.tsx       # Root layout with Geist fonts
├── page.tsx         # Home page (scaffold)
└── globals.css      # Tailwind + CSS variables
```

Currently a minimal scaffold. Uses App Router with server components.

## Code Style

- **Line length:** 100 characters
- **Python:** 4 spaces, ruff for linting/formatting, mypy strict mode
- **TypeScript:** 2 spaces, Prettier + ESLint
- **Pre-commit hooks:** Husky runs formatters and linters automatically

## Database

- PostgreSQL via Supabase
- Alembic for migrations (scaffold only - development uses `init_db()`)
- Connection via `asyncpg` with async sessions
