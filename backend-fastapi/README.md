# FastAPI Boilerplate

Production-grade FastAPI starter with async SQLAlchemy, JWT auth, modular structure.

## Stack
- **FastAPI** + **Uvicorn**
- **SQLAlchemy 2 (async)** + **Alembic**
- **PostgreSQL** (asyncpg driver)
- **Redis** (rate limiting, caching)
- **Pydantic v2** + **pydantic-settings**
- **structlog** (structured JSON logging)
- **Ruff** + **mypy** + **pytest**

## Structure
```
app/
├── api/v1/endpoints/   # Route handlers (thin — just HTTP in/out)
├── core/               # Config, security, logging, exceptions
├── db/                 # Engine, session, base model imports
├── models/             # SQLAlchemy ORM models
├── schemas/            # Pydantic request/response models
├── services/           # Business logic
├── repositories/       # DB queries (generic BaseRepository + per-model)
└── middleware/         # Logging, rate limiting
```

## Quickstart
```bash
cp .env.example .env          # fill in DATABASE_URL, SECRET_KEY
make install
make migrate                   # run alembic migrations
make superuser                 # create admin user
make dev                       # run with hot reload
```

## Adding a new module
1. `app/models/thing.py` → define SQLAlchemy model
2. `app/db/base.py` → import model so Alembic sees it
3. `app/schemas/thing.py` → Pydantic schemas
4. `app/repositories/thing.py` → extend BaseRepository
5. `app/services/thing.py` → business logic
6. `app/api/v1/endpoints/thing.py` → route handlers
7. `app/api/v1/router.py` → `include_router`
8. `make migration msg="add thing table"`

## Testing
```bash
make test
```

## Deployment
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```
For Docker, use `gunicorn -k uvicorn.workers.UvicornWorker`.
