# Deployment runbook

Deployment has not been performed. This runbook is intentionally provider-neutral so it can be applied to
a static frontend host, Python web-service host, and managed PostgreSQL provider selected by the owner.

## Required production configuration

- `DATABASE_URL`: managed PostgreSQL URL using `postgresql+psycopg`.
- `JWT_SECRET`: unique random value of at least 32 characters.
- `APP_ENV=production`.
- `CORS_ORIGINS`: JSON array containing the exact HTTPS frontend origin.
- `VITE_API_BASE_URL`: public HTTPS backend origin, set at frontend build time.

Never place these values in Git, screenshots, frontend source, or browser storage.

## Release order

1. Create managed PostgreSQL with backups and persistent storage enabled.
2. Configure backend variables, build with `python -m pip install -e .`, and start with
   `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
3. Run `alembic upgrade head` against the production database once, using a privileged deployment job.
4. Configure the backend health check as `GET /health`.
5. Deploy the frontend with `npm ci && npm run build`; configure `VITE_API_BASE_URL` before that build.
6. Set the backend CORS allow-list to the final frontend URL, then smoke-test registration, login, search,
   purchase, and an administrator action over HTTPS.

## Preconditions before release

- Run the full backend suite, migrations, and PostgreSQL concurrency test successfully.
- Capture clean screenshots from the deployed app; do not include secrets or real customer data.
- Check current provider pricing, region, quota, and sleep/egress policies in the provider's official console
  before selecting a plan. These terms change and were not independently verified in this workspace.
- Record the deployed frontend URL, backend URL, and CI run URL in the release report.
