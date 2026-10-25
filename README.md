# Car Dealership Inventory System

A production-minded foundation for incrementally building a dealership inventory workflow. The
project is a modular FastAPI/PostgreSQL backend plus a React/TypeScript frontend, developed with
tests first.

## Prerequisites

- Python 3.12 or 3.13
- PostgreSQL 16 or newer
- Node.js 22 LTS and npm 10+
- Git

## First-time setup

Copy `.env.example` to `.env` and replace the placeholder database passwords. Create separate
`dealership` and `dealership_test` PostgreSQL databases; never point `TEST_DATABASE_URL` at production.

### Backend

```powershell
cd backend
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -e ".[dev]"
alembic upgrade head
uvicorn app.main:app --reload
```

The API is available at `http://localhost:8000`; development OpenAPI documentation is at
`http://localhost:8000/docs`.

### Frontend

```powershell
cd frontend
npm ci
npm run dev
```

The web application is available at `http://localhost:5173`.

## Verification

Run backend checks from `backend/`:

```powershell
ruff check .
ruff format --check .
mypy app tests
pytest --cov=app --cov-report=term-missing
alembic upgrade head
```

Run frontend checks from `frontend/`:

```powershell
npm run lint
npm run format:check
npm test
npm run build
```

## Migrations

Import new SQLAlchemy models into `app.db.base` before generating revisions so Alembic can see their
metadata. After changing a model:

```powershell
cd backend
alembic revision --autogenerate -m "describe schema change"
alembic upgrade head
```

Review every generated migration before running or committing it. The first revision is intentionally
an empty baseline: Phase 1 defines no speculative domain tables.

## Project guide

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) records boundaries and design decisions.
- [`docs/TDD_LOG.md`](docs/TDD_LOG.md) preserves the initial red/green evidence.
- [`PROMPTS.md`](PROMPTS.md) records authentic AI-assisted work for assessment transparency.
- [`.github/workflows/ci.yml`](.github/workflows/ci.yml) reproduces checks with disposable PostgreSQL.

## Current scope

Phase 1 provides the health contract, validated configuration, database lifecycle, migration tooling,
test fixtures, quality gates, frontend shell, and CI. It intentionally does not invent vehicle,
dealership, user, or authentication requirements. Phase 2 should begin with one concrete inventory
user story and its first failing domain test.

