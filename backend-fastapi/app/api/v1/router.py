from fastapi import APIRouter

from app.modules.auth import router as auth_module
from app.modules.health import router as health_module
from app.modules.users import router as users_module

router = APIRouter()

router.include_router(health_module.router, tags=["health"])
router.include_router(auth_module.router, prefix="/auth", tags=["auth"])
router.include_router(users_module.router, prefix="/users", tags=["users"])
