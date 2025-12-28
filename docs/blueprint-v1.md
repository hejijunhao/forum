# Forum — Technical Blueprint v1

> This document captures technical decisions and architecture for Phase 1.
> See `vision.md` for product philosophy and scope.

---

## Decisions Made

### Scope
- **Personal-first**: No multi-tenancy in Phase 1. Single-user experience.
- **Multi-tenancy later**: Data model should not block future team/org support.

### GitHub Integration
- Users authenticate with GitHub OAuth to import their repositories.
- Repos are imported as metadata (name, URL, description) — not cloned or synced.
- **Products/Apps are user-defined**: Users decide how to group repos into Products, independent of GitHub's organisation structure.

### UI Philosophy
- **Ultra-lightweight and minimalist**: Should feel refreshingly simple compared to typical dev tools.
- **Terminal-style command interface**: A persistent input area for future "personal agent" interactions.
  - Phase 1: UI shell only (no functionality).
  - Designed as first-class, not bolted-on.

---

## Tech Stack

| Layer     | Technology | Notes |
|-----------|------------|-------|
| Frontend  | **Next.js** (App Router) | React Server Components for minimal client JS |
| Backend   | **FastAPI** (Python) | Async, typed, auto-generates OpenAPI spec |
| Database  | **Supabase** (Postgres) | Includes auth, RLS for future multi-tenancy |
| Auth      | **Supabase Auth** | GitHub OAuth provider |

### Why This Stack
- **Separation of concerns**: Next.js handles UI; FastAPI provides the "agent-ready" API contract.
- **Supabase**: Postgres gives us a robust relational model. Built-in auth simplifies GitHub OAuth. Row Level Security prepares us for multi-tenancy without schema changes.
- **FastAPI**: Python ecosystem is strong for future AI/agent integrations.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                      │
│  ┌─────────────────┐  ┌──────────────────────────────────┐  │
│  │  Sidebar        │  │       Main Content Area          │  │
│  │  - Products     │  │  (Product detail, Repos, Docs,   │  │
│  │  - Navigation   │  │   Work items, App Info)          │  │
│  └─────────────────┘  └──────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Terminal / Command Bar (persistent, bottom-docked)    ││
│  │  Phase 1: UI only — agent functionality comes later    ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Backend (FastAPI)                       │
│                                                             │
│  Core Endpoints:                                            │
│    /api/products      - CRUD for products/apps              │
│    /api/repositories  - CRUD for repos within products     │
│    /api/work          - Work items (tasks, features, etc.) │
│    /api/docs          - Documentation entries               │
│    /api/app-info      - Environment vars, URLs, notes       │
│                                                             │
│  Integration:                                               │
│    /api/github/repos  - Fetch user's GitHub repos          │
│    /api/github/import - Import selected repos              │
│                                                             │
│  Future:                                                    │
│    /api/command       - Agent command processing            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Supabase (Postgres)                       │
│                                                             │
│  Tables:                                                    │
│    users          - User accounts (via Supabase Auth)       │
│    products       - Products/Apps container                 │
│    repositories   - Repos linked to products                │
│    work_items     - Tasks, features, fixes, investigations │
│    documents      - Documentation entries                   │
│    app_info       - Key-value store for project context    │
│                                                             │
│  Auth:                                                      │
│    GitHub OAuth provider configured in Supabase             │
└─────────────────────────────────────────────────────────────┘
```

---

## Terminal / Command Interface

The terminal UI is a **first-class design element**, not a hidden shortcut.

### Design Direction
- **Persistent dock at bottom**: Always visible, expands on focus.
- Reinforces that the "personal agent" is always present and ready.
- Distinguishes Forum from tools that merely have a ⌘K command palette.

### Phase 1 Behaviour
- Renders as a styled input area with placeholder text (e.g., "Ask your agent anything...").
- Accepts input but displays a friendly "Coming soon" or similar response.
- No backend integration yet.

### Future Capabilities (Phase 2+)
- Natural language queries: "What did I work on last week?"
- Quick actions: "Create a task for fixing the auth bug in webapp"
- Context-aware suggestions based on current view.

---

## Data Model (Conceptual)

```
User (1) ──────< Product (many)
                    │
                    ├──< Repository (many)
                    │
                    ├──< WorkItem (many)
                    │       └── type: feature | fix | refactor | investigation
                    │       └── status: todo | in_progress | done
                    │
                    ├──< Document (many)
                    │       └── type: blueprint | architecture | note | plan
                    │
                    └──< AppInfo (many)
                            └── key-value pairs (env vars, URLs, etc.)
```

---

## Next Steps

### 1. Database Schema
- Draft detailed Postgres schema for all entities.
- Include indexes, constraints, and RLS policies (prepared for multi-tenancy).
- Define the `app_info` structure (flat key-value vs. structured JSON).

### 2. Project Scaffolding
- Set up monorepo structure:
  ```
  /forum
    /frontend    (Next.js app)
    /backend     (FastAPI app)
    /docs        (this documentation)
  ```
- Configure shared tooling (linting, formatting, git hooks).
- Set up Supabase project and initial migration.

### 3. Terminal UI Component Design
- Design the visual appearance (expanded/collapsed states).
- Define interaction patterns (keyboard shortcuts, focus behaviour).
- Build as a reusable component ready for future agent integration.

---

## Open Questions

- **Naming**: "Products" vs "Apps" vs "Projects" — which resonates best?
- **Document editor**: Rich text (Notion-like) vs Markdown-first?
- **Repo sync**: Should we periodically refresh repo metadata from GitHub, or is one-time import sufficient?

---

*Last updated: 2025-01-29*
