"""Run: python scripts/create_superuser.py"""
import asyncio

from app.db.session import AsyncSessionLocal
from app.core.security import hash_password
from app.models.user import User


async def main():
    email = input("Email: ")
    password = input("Password: ")
    full_name = input("Full name (optional): ")

    async with AsyncSessionLocal() as db:
        user = User(
            email=email,
            hashed_password=hash_password(password),
            full_name=full_name or None,
            is_superuser=True,
            is_active=True,
        )
        db.add(user)
        await db.commit()
        print(f"Superuser {email} created.")


if __name__ == "__main__":
    asyncio.run(main())
