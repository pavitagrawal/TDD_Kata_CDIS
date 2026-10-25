# Architecture

## Shape

This is a deliberately small modular monolith with two deployable applications:

- `backend/` is a synchronous FastAPI API backed by PostgreSQL through SQLAlchemy 2.x.
- `frontend/` is a React single-page application built by Vite.

Keeping the first business capabilities in one backend avoids network boundaries and distributed
transactions before the domain earns that complexity. HTTP routes translate transport concerns,
services hold business decisions, schemas define API contracts, and database modules own
persistence lifecycle. Direct SQLAlchemy usage is preferred until repeated domain queries justify a
repository abstraction.

## Backend dependency direction

`routes -> services -> schemas/models`

Configuration and database session creation are infrastructure dependencies. Route functions may
receive a session through FastAPI dependency injection; services should receive explicit values and
dependencies so they remain straightforward to test.

The application requires a PostgreSQL URL at startup. It never silently substitutes SQLite. Every
database schema change is represented by an Alembic revision.

## Frontend boundaries

- `pages/` composes a user workflow.
- `components/` contains reusable presentation pieces.
- `api/` owns HTTP details and converts non-success responses to typed errors.
- `auth/` owns identity state; it is intentionally anonymous until authentication is specified.
- `types/` contains shared client-side contracts.

## Security posture

Secrets come from the environment and `.env` files are ignored. API docs are disabled in production.
CORS is an explicit allow-list. Authentication, authorization, password handling, and security headers
will be added only alongside a defined user story and corresponding tests.

## Testing strategy

Fast unit/API tests run without a database. Integration tests opt into a PostgreSQL database through
`TEST_DATABASE_URL`, validate that its name is clearly test-only, and roll each test transaction back.
CI supplies a disposable PostgreSQL service and applies migrations before testing. Frontend behavior
is specified with Vitest and Testing Library rather than implementation-detail assertions.

