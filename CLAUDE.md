# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

```
fastapi-nextjs-boilerplate/
├── backend-fastapi/   # Python / FastAPI API
└── frontend-nextjs/   # Next.js 16 / React 19 frontend
```

---

## Backend (`backend-fastapi/`)

### Commands

```bash
# Install deps (dev includes ruff, mypy, pytest)
pip install -r requirements-dev.txt

# Run dev server (auto-reload)
make dev          # uvicorn app.main:app --reload on :8000

# Run all tests
make test         # pytest -v

# Run a single test file / test
pytest tests/unit/test_users.py
pytest tests/unit/test_users.py::test_create_user

# Lint & type-check
make lint         # ruff check + mypy

# Format
make format       # ruff format

# Migrations
make migrate                     # alembic upgrade head
make migration msg="add_column"  # autogenerate new revision
make downgrade                   # alembic downgrade -1

# Create superuser
python scripts/create_superuser.py
```

### Architecture

All application code lives under `app/`:

- **`core/`** — config (`Settings` via pydantic-settings, env-sourced), security (JWT encode/decode, password hashing), exception hierarchy, structured logging (structlog).
- **`db/`** — SQLAlchemy async engine/session (`get_db` async generator), `Base` declarative base, `UUIDMixin` (UUID pk), `TimestampMixin` (`created_at`/`updated_at`).
- **`shared/`** — `BaseRepository[T]` generic (get/get_multi/create/update/delete), `BaseResponse[T]` envelope (`ok()` / `err()` helpers), `DbDep`/`CurrentUser`/`SuperUser` FastAPI dependency aliases.
- **`modules/<name>/`** — self-contained feature slice: `model.py`, `schemas.py`, `repository.py` (extends `BaseRepository`), `service.py`, `router.py`. Register the router in `api/v1/router.py`.
- **`middleware/`** — `LoggingMiddleware` (per-request structlog), `RateLimitMiddleware` (Redis-backed).

**Request lifecycle:** Router → Service → Repository → DB. Services raise typed `AppException` subclasses (`NotFoundException`, `ConflictException`, etc.); global handlers in `core/exceptions.py` convert them to the `BaseResponse` envelope.

**All API responses** use the `BaseResponse[T]` envelope: `{ success, status_code, message, data }`. Return `ok(data)` or `err(message, status_code=...)` from routers.

**Auth:** JWT access token (30 min) + refresh token (7 days), HS256. `CurrentUser` / `SuperUser` are drop-in FastAPI `Depends` aliases defined in `shared/deps.py`.

**Tests** use SQLite (`aiosqlite`) with `httpx.AsyncClient` against the real ASGI app. The `conftest.py` overrides `get_db` for isolation — no mocks.

### Adding a new module

1. Create `app/modules/<name>/` with `model.py`, `schemas.py`, `repository.py`, `service.py`, `router.py`.
2. Extend `BaseRepository[YourModel]` in `repository.py`.
3. Register the router in `app/api/v1/router.py`.
4. Import the model in `tests/conftest.py` so `Base.metadata` picks it up.

---

## Frontend (`frontend-nextjs/`)

> **Warning:** This is Next.js 16 / React 19. APIs differ from older versions. Read `node_modules/next/dist/docs/` before writing any code (see `AGENTS.md`).

### Commands

```bash
npm run dev      # dev server on :3000
npm run build
npm run lint
```

### Architecture

**Route groups** (`src/app/`):
- `(auth)/` — unauthenticated pages (e.g. `/login`), minimal layout.
- `(dashboard)/` — authenticated pages, full shell layout with navbar.

**Service layer** (`src/services/<resource>/`): each resource has `api.ts` (HTTP calls + Server Actions), `hooks.ts` (React Query mutations/queries), `types.ts`, `keys.ts` (query key factories). Server Actions (`"use server"`) call the API and manage cookies; client hooks call Server Actions via `useMutation`.

**Auth session**: Tokens stored as `httpOnly` cookies via `src/lib/auth.ts` (`server-only`). `setSession` / `clearSession` / `getAccessToken` are server-only helpers — never call them from client components.

**API client** (`src/lib/api-client.ts`): thin `fetch` wrapper (`http.get/post/put/patch/delete`). Reads `NEXT_PUBLIC_API_URL` (default `http://localhost:8000`). Unwraps the `BaseResponse` envelope and throws `ApiError` on failure.

**UI components**: shadcn/ui primitives in `src/components/ui/`. Feature components in `src/components/`. State management via Zustand; server state via TanStack Query v5.

### Adding a new feature

1. Add `src/services/<name>/` with `types.ts`, `api.ts` (Server Actions), `hooks.ts`, `keys.ts`.
2. Add pages under the appropriate route group in `src/app/`.
3. UI components go in `src/components/` (shared) or co-located with the page.
