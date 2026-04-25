from fastapi import APIRouter
from sqlalchemy import text

from app.core.config import settings
from app.shared.deps import DbDep

router = APIRouter()


@router.get("/health")
async def health_check():
    return {"status": "ok", "app": settings.APP_NAME, "env": settings.APP_ENV}


@router.get("/health/db")
async def db_health(db: DbDep):
    await db.execute(text("SELECT 1"))
    return {"status": "ok", "db": "connected"}
