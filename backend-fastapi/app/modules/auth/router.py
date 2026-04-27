from fastapi import APIRouter

from app.modules.auth.schemas import LoginRequest, RefreshRequest, TokenResponse
from app.modules.auth.service import AuthService
from app.shared.deps import DbDep
from app.shared.schemas import BaseResponse, ok

router = APIRouter()


@router.post("/login", response_model=BaseResponse[TokenResponse])
async def login(data: LoginRequest, db: DbDep):
    return ok(await AuthService(db).login(data.email, data.password))


@router.post("/refresh", response_model=BaseResponse[TokenResponse])
async def refresh_token(data: RefreshRequest, db: DbDep):
    return ok(await AuthService(db).refresh(data.refresh_token))
