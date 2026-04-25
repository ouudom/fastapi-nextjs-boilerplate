.PHONY: run dev install test lint migrate

install:
	pip install -r requirements-dev.txt

run:
	uvicorn app.main:app --host 0.0.0.0 --port 8000

dev:
	uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

test:
	pytest -v

lint:
	ruff check app tests
	mypy app

format:
	ruff format app tests

# Alembic
migrate:
	alembic upgrade head

migration:
	alembic revision --autogenerate -m "$(msg)"

downgrade:
	alembic downgrade -1

# Utils
superuser:
	python scripts/create_superuser.py
