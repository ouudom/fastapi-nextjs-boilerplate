import time

import redis.asyncio as aioredis
from fastapi import status
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse, Response

from app.core.config import settings


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, redis_url: str = settings.REDIS_URL) -> None:
        super().__init__(app)
        self.redis = aioredis.from_url(redis_url, decode_responses=True)
        self.limit = settings.RATE_LIMIT_PER_MINUTE
        self.window = 60  # seconds

    async def dispatch(self, request: Request, call_next) -> Response:
        # Skip health checks
        if request.url.path in {"/api/v1/health", "/api/v1/health/db"}:
            return await call_next(request)

        client_ip = request.client.host if request.client else "unknown"
        key = f"rate_limit:{client_ip}"
        now = int(time.time())
        window_start = now - self.window

        async with self.redis.pipeline() as pipe:
            pipe.zremrangebyscore(key, 0, window_start)
            pipe.zadd(key, {str(now): now})
            pipe.zcard(key)
            pipe.expire(key, self.window)
            results = await pipe.execute()

        count = results[2]
        if count > self.limit:
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={"detail": "Rate limit exceeded", "status_code": 429},
                headers={"Retry-After": str(self.window)},
            )

        response = await call_next(request)
        response.headers["X-RateLimit-Limit"] = str(self.limit)
        response.headers["X-RateLimit-Remaining"] = str(max(0, self.limit - count))
        return response
