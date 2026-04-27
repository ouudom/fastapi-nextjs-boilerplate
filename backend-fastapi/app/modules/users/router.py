import math
import uuid

from fastapi import APIRouter, Query, status

from app.modules.users.schemas import UserCreate, UserResponse, UserUpdate
from app.modules.users.service import UserService
from app.shared.deps import CurrentUser, DbDep, SuperUser
from app.shared.schemas import BaseResponse, PaginatedData, Pagination, ok

router = APIRouter()


@router.get("/me", response_model=BaseResponse[UserResponse])
async def get_me(current_user: CurrentUser):
    return ok(current_user)


@router.patch("/me", response_model=BaseResponse[UserResponse])
async def update_me(data: UserUpdate, current_user: CurrentUser, db: DbDep):
    return ok(await UserService(db).update_user(current_user.id, data))


# ── Admin-only ─────────────────────────────────────────────────────────────────

@router.get("", response_model=BaseResponse[PaginatedData[UserResponse]])
async def list_users(
    _: SuperUser,
    db: DbDep,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
):
    users, total = await UserService(db).list_users(page=page, size=size)
    return ok(PaginatedData(
        items=users,
        pagination=Pagination(total=total, page=page, size=size, pages=math.ceil(total / size)),
    ))


@router.post("", response_model=BaseResponse[UserResponse], status_code=status.HTTP_201_CREATED)
async def create_user(data: UserCreate, _: SuperUser, db: DbDep):
    return ok(await UserService(db).create_user(data), status_code=201)


@router.get("/{user_id}", response_model=BaseResponse[UserResponse])
async def get_user(user_id: uuid.UUID, _: SuperUser, db: DbDep):
    return ok(await UserService(db).get_or_404(user_id))


@router.patch("/{user_id}", response_model=BaseResponse[UserResponse])
async def update_user(user_id: uuid.UUID, data: UserUpdate, _: SuperUser, db: DbDep):
    return ok(await UserService(db).update_user(user_id, data))


@router.delete("/{user_id}", response_model=BaseResponse[None])
async def delete_user(user_id: uuid.UUID, _: SuperUser, db: DbDep):
    await UserService(db).delete_user(user_id)
    return ok(message="User deleted")
