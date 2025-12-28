# Forum — Product Vision & Scope

## What Forum Is

Forum is an open-source, lightweight workspace for building software products.  
It is designed around **Products / Apps and their Repositories**, providing a calm, structured place where developers (and later, AI agents) can track development work, maintain documentation, and keep essential project context in one place.

Forum deliberately avoids heavy project-management mechanics. It is not a Jira or Linear alternative in the traditional sense. Instead, it feels closer to a shared, structured Notion workspace—**organic, readable, and repo-centric**, while still being precise enough to support automation and agents later on.

Phase 1 focuses entirely on **human-driven workflows**. All actions (creating tasks, writing documentation, updating app info) are done manually by developers. The system is designed so that an agent layer can be added later without changing the core data model or UX.

---

## Core Building Blocks

Forum is built around a small set of first-class concepts:

### Products / Apps
- Represent a software product or application.
- Each Product may have one or multiple Repositories.
- Typically includes a frontend/backend split, but remains flexible.
- Acts as the primary container for all related work and knowledge.

### Repositories
- Logical representations of codebases linked to a Product.
- Used for organisation and context, not as a replacement for GitHub/GitLab.
- Repos help scope work, documentation, and technical notes.

---

## What Lives Inside Each Product

Each Product provides three core areas:

### A) Work (Tasks / Dev Items)
- Lightweight development work items (features, fixes, refactors, investigations).
- No deadlines, sprints, story points, or mandatory workflows.
- Designed to feel organic—like shared to-dos rather than formal tickets.
- Used by developers to track what is being worked on or has been completed.

### B) Documentation
- First-class, central to the product.
- Includes:
  - high-level blueprints and overviews
  - architecture notes
  - implementation plans
  - technical or business notes
- Documentation is expected to evolve over time.
- Structured enough to later support agent-generated and agent-maintained docs.

### C) App Info / Project Context
- Practical, high-signal project information in one place:
  - environment variables (optionally protected)
  - service URLs
  - infrastructure notes
  - links to dashboards and external tools
- Optimised for fast onboarding and reduced friction when switching machines or contexts.

---

## Key Use Cases

- Developers get a **clear overview of all Products and Repositories** they work on.
- Teams track development work without being dragged into heavy PM processes.
- Documentation stays close to the code and evolves alongside it.
- Business and technical stakeholders can understand a product’s structure quickly.
- Future AI agents can read and operate on the same structured data without redesign.

---

## Product Philosophy

- Minimal, calm, and readable by default.
- Opinionated enough to stay simple, flexible enough to grow.
- Designed for humans first, **agent-ready by design**, but not agent-dependent.
- Focused on shared understanding, not process enforcement.

Forum is the foundation layer. Automation and agents come later.
