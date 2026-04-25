from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy import text

from app.core.config import settings
from app.shared.deps import DbDep
from app.shared.schemas import BaseResponse, ok

router = APIRouter()


class HealthData(BaseModel):
    status: str
    app: str
    env: str


class DbHealthData(BaseModel):
    status: str
    db: str


@router.get("/health", response_model=BaseResponse[HealthData])
async def health_check():
    return ok(HealthData(status="ok", app=settings.APP_NAME, env=settings.APP_ENV))


@router.get("/health/db", response_model=BaseResponse[DbHealthData])
async def db_health(db: DbDep):
    await db.execute(text("SELECT 1"))
    return ok(DbHealthData(status="ok", db="connected"))
