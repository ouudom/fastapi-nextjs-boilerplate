from typing import Any, Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


# ── Pagination ─────────────────────────────────────────────────────────────────

class Pagination(BaseModel):
    total: int
    page: int
    size: int
    pages: int


class PaginatedData(BaseModel, Generic[T]):
    items: list[T]
    pagination: Pagination


# ── Envelope ───────────────────────────────────────────────────────────────────

class BaseResponse(BaseModel, Generic[T]):
    success: bool
    status_code: int
    message: str | None = None
    data: T | None = None

    model_config = {"from_attributes": True}


# ── Helpers ────────────────────────────────────────────────────────────────────

def ok(data: Any = None, *, status_code: int = 200, message: str | None = None) -> BaseResponse:
    return BaseResponse(success=True, status_code=status_code, data=data, message=message)


def err(message: str, *, status_code: int = 500) -> BaseResponse:
    return BaseResponse(success=False, status_code=status_code, data=None, message=message)
