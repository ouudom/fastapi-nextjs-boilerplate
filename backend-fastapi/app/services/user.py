from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ConflictException, NotFoundException
from app.core.security import hash_password
from app.models.user import User
from app.repositories.user import UserRepository
from app.schemas.user import UserCreate, UserUpdate


class UserService:
    def __init__(self, db: AsyncSession) -> None:
        self.repo = UserRepository(db)

    async def get_or_404(self, user_id: UUID) -> User:
        user = await self.repo.get(user_id)
        if not user:
            raise NotFoundException(f"User {user_id} not found")
        return user

    async def list_users(self, page: int = 1, size: int = 20) -> tuple[list[User], int]:
        skip = (page - 1) * size
        return await self.repo.get_multi(skip=skip, limit=size)

    async def create_user(self, data: UserCreate) -> User:
        if await self.repo.get_by_email(data.email):
            raise ConflictException(f"Email {data.email} already registered")
        return await self.repo.create({
            "email": data.email,
            "hashed_password": hash_password(data.password),
            "full_name": data.full_name,
        })

    async def update_user(self, user_id: UUID, data: UserUpdate) -> User:
        user = await self.get_or_404(user_id)
        updates = data.model_dump(exclude_unset=True)
        if "password" in updates:
            updates["hashed_password"] = hash_password(updates.pop("password"))
        return await self.repo.update(user, updates)

    async def delete_user(self, user_id: UUID) -> None:
        user = await self.get_or_404(user_id)
        await self.repo.delete(user)
