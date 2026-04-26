# FastAPI + Next.js Boilerplate

Full-stack boilerplate with a modular FastAPI backend and a Next.js 16 / React 19 frontend.

## Stack

| Layer | Tech |
|---|---|
| Backend | FastAPI, SQLAlchemy 2 (async), Alembic, PostgreSQL, Redis |
| Auth | JWT (access + refresh), passlib/bcrypt |
| Frontend | Next.js 16, React 19, TanStack Query v5, Zustand, shadcn/ui, Tailwind CSS v4 |
| Observability | structlog, Sentry |

## Project structure

```
fastapi-nextjs-boilerplate/
├── backend-fastapi/
│   ├── app/
│   │   ├── api/v1/          # Route aggregation
│   │   ├── core/            # Config, security, logging, exceptions
│   │   ├── db/              # SQLAlchemy base, session, mixins
│   │   ├── middleware/      # Logging, rate-limit
│   │   ├── modules/         # Feature slices (auth, users, …)
│   │   └── shared/          # BaseRepository, BaseResponse, deps
│   ├── alembic/             # DB migrations
│   ├── tests/
│   └── Makefile
└── frontend-nextjs/
    └── src/
        ├── app/
        │   ├── (auth)/      # Unauthenticated pages
        │   └── (dashboard)/ # Authenticated pages
        ├── components/      # UI components
        ├── lib/             # API client, auth helpers
        ├── providers/       # React context providers
        └── services/        # Per-resource API + React Query hooks
```

## Quick start

### Backend

```bash
cd backend-fastapi
cp .env.example .env        # fill in DATABASE_URL, SECRET_KEY, REDIS_URL
pip install -r requirements-dev.txt
make migrate                # run alembic migrations
make dev                    # uvicorn on :8000 with --reload
```

API docs available at `http://localhost:8000/docs` (non-production only).

### Frontend

```bash
cd frontend-nextjs
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL if needed
npm install
npm run dev                         # Next.js on :3000
```

## API contract

All endpoints return a unified envelope:

```json
{ "success": true, "status_code": 200, "message": null, "data": { ... } }
```

Paginated responses wrap the list in `data.items` + `data.pagination`.

## Auth flow

1. `POST /api/v1/auth/login` → access token (30 min) + refresh token (7 days).
2. Frontend stores both as `httpOnly` cookies.
3. `POST /api/v1/auth/refresh` exchanges a valid refresh token for new tokens.

## Key make targets (backend)

| Command | Description |
|---|---|
| `make dev` | Run with auto-reload |
| `make test` | Run test suite |
| `make lint` | ruff + mypy |
| `make format` | ruff format |
| `make migrate` | Apply migrations |
| `make migration msg="..."` | Autogenerate migration |
| `make superuser` | Create admin user |
