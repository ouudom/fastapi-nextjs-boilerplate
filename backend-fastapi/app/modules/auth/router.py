from fastapi import APIRouter

from app.modules.auth.schemas import LoginRequest, RefreshRequest, TokenResponse
from app.modules.auth.service import AuthService
from app.shared.deps import DbDep

router = APIRouter()


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest, db: DbDep):
    return await AuthService(db).login(data.email, data.password)


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(data: RefreshRequest, db: DbDep):
    return await AuthService(db).refresh(data.refresh_token)
