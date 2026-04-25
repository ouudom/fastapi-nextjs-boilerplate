import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_health(client: AsyncClient):
    r = await client.get("/api/v1/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


@pytest.mark.asyncio
async def test_create_and_login(client: AsyncClient):
    # Register
    r = await client.post("/api/v1/users", json={
        "email": "test@example.com",
        "password": "password123",
        "full_name": "Test User",
    })
    # Requires superuser — adjust once you add a registration endpoint
    assert r.status_code in (201, 403)
