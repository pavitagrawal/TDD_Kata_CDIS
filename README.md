# Car Dealership Inventory System

A full-stack dealership inventory application for dealership staff and prospective buyers. It combines
a FastAPI/PostgreSQL API with a responsive React interface, and focuses on explicit business rules,
clear authorization boundaries, and an incremental TDD workflow.

## Features

- Registration, login, bearer-token authentication, and current-user lookup.
- Server-enforced `user` and `admin` roles; users cannot self-assign administrator access.
- Admin-only vehicle creation, editing, deletion, and restocking endpoints.
- Authenticated inventory browsing, filtering by make/model/category/price, and purchasing.
- Decimal-compatible monetary values, non-negative database constraints, and atomic stock decrement.
- Responsive inventory dashboard, filters, stock-aware purchase controls, registration/login flows, and
  accessible vehicle details dialog.

The dedicated frontend administrator workspace remains incomplete. Server-side authorization is the
source of truth; visible controls are never relied upon for security.

## Architecture

```text
React + TypeScript UI  ->  FastAPI routes  ->  services  ->  SQLAlchemy/PostgreSQL
       bearer token          schemas             business rules      Alembic migrations
```

Routes own HTTP concerns, services own inventory/authentication decisions, and SQLAlchemy owns
persistence. A purchase uses one conditional SQL `UPDATE ... WHERE stock_quantity > 0` so competing
requests cannot each decrement the final vehicle under PostgreSQL.

## Stack

- Python 3.12+, FastAPI, Pydantic, SQLAlchemy 2, Alembic, psycopg, PyJWT, and pwdlib/Argon2id.
- PostgreSQL for production and integration testing; SQLite is intentionally rejected by configuration.
- React 19, TypeScript, Vite, Tailwind CSS, Vitest, React Testing Library, ESLint, and Prettier.
- GitHub Actions with an ephemeral PostgreSQL service.

## Prerequisites

- Python 3.12 or 3.13, Node.js 22 LTS, npm, Git, and PostgreSQL 16+.
- Two isolated databases: `dealership` and `dealership_test`.

## Local setup

```powershell
git clone <your-repository-url>
cd TDD_Kata_CDIS
Copy-Item .env.example .env
```

Set real local values in `.env`; never commit it. At minimum configure `DATABASE_URL`,
`TEST_DATABASE_URL`, and a random `JWT_SECRET` of 32+ characters.

```powershell
cd backend
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -e ".[dev]"
alembic upgrade head
uvicorn app.main:app --reload
```

In another terminal:

```powershell
cd frontend
npm ci
npm run dev
```

The API is at `http://localhost:8000`, OpenAPI documentation at `/docs`, and the frontend at
`http://localhost:5173`.

## API

| Endpoint | Access | Purpose |
| --- | --- | --- |
| `POST /api/auth/register` | Public | Create a standard user |
| `POST /api/auth/login` | Public | Receive an expiring bearer token |
| `GET /api/auth/me` | Authenticated | Read the current user |
| `GET /api/vehicles`, `/search` | Authenticated | Browse/filter inventory |
| `POST`, `PUT`, `DELETE /api/vehicles` | Admin | Manage inventory |
| `POST /api/vehicles/{id}/purchase` | Authenticated | Purchase one available unit |
| `POST /api/vehicles/{id}/restock` | Admin | Increase stock |

Example login request:

```json
{ "email": "buyer@example.test", "password": "eight-or-more-characters" }
```

Typical errors are `401` for missing/invalid credentials, `403` for an authenticated non-admin,
`404` for an unknown vehicle, `409` for duplicate email/out-of-stock purchase, and `422` for invalid input.

## Tests and quality checks

```powershell
# backend, from backend/
ruff check .
ruff format --check .
mypy app tests
pytest --cov=app --cov-report=term-missing
alembic upgrade head

# frontend, from frontend/
npm run lint
npm run format:check
npm test
npm run build
npm audit --audit-level=high
```

Actual local result on 2026-10-25: frontend lint, formatting, two Vitest tests, and production build
passed. Python syntax compilation passed. Backend tests, coverage, migrations, type checks, and
PostgreSQL concurrency verification did not run because Python dependencies could not be installed
from PyPI and PostgreSQL/Docker are unavailable. `npm audit` could not reach its registry endpoint.

## Deployment

No deployment is currently configured or verified. See [deployment instructions](docs/DEPLOYMENT.md)
for the required environment variables, migration order, CORS setup, health check, and release checklist.

## Screenshots

No repository screenshot artifacts have been committed. A local browser inspection verified the inventory
dashboard, filters, stock-disabled purchase action, and details dialog. Capture fresh screenshots only
after starting the real backend; do not present preview data as a production demonstration.

## Engineering decisions and trade-offs

- **Atomic purchase:** a conditional update protects stock; the trade-off is that its concurrent behavior
  still needs PostgreSQL integration proof in this environment.
- **Bearer tokens in memory:** avoids persistent browser-token storage; refresh signs the user out.
- **Small modular monolith:** routes, services, and schemas are separate, without premature repositories
  or microservices.
- **Test database isolation:** `TEST_DATABASE_URL` must visibly target a test database and test sessions
  roll back transactions.

## My AI Usage

AI assistance was used to scaffold code, propose tests, draft documentation, diagnose lint/build failures,
and iterate on the responsive UI. Every generated change was reviewed against the repository, and frontend
quality gates were run locally. AI suggestions required correction: dependency installation and backend
test claims were not accepted without evidence, a stale frontend test was updated only after it failed, and
environment limitations are recorded rather than hidden. Product scope, approval to publish, secrets, and
deployment decisions remain the developer's responsibility.

`PROMPTS.md` preserves the available authentic conversation record. Later full raw transcripts are not
present in the repository; add authentic exports or public chat links before an assessment submission.

## Future improvements

- Complete and test the administrator inventory workspace.
- Run PostgreSQL integration, migration, rollback, and concurrent-purchase tests in CI/local Docker.
- Add rate limiting to authentication routes and deployment monitoring.
- Deploy only after the release checklist passes with real environment values.

## Project material

- [Architecture](docs/ARCHITECTURE.md)
- [TDD log](docs/TDD_LOG.md)
- [Engineering review](docs/ENGINEERING_REVIEW.md)
- [Deployment runbook](docs/DEPLOYMENT.md)
- [Interview guide](docs/INTERVIEW_GUIDE.md)
- [AI interaction record](PROMPTS.md)
