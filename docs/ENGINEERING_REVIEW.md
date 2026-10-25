# Engineering review — Phase 4

## Confirmed fixes

- **High: invalid token lifetime configuration** — non-positive access-token expiry values are now
  rejected. A zero or negative lifetime produces unusable sessions and can make authentication fail
  in confusing ways. Values are constrained to 1–1,440 minutes.
- **Medium: whitespace-only vehicle fields** — makes, models, and categories are now trimmed and
  rejected when blank for both creates and updates. This protects the database from unusable inventory
  records while retaining the public API shape.
- **Medium: details control was not a details view** — vehicle details now open an accessible modal
  with price and live stock information.
- **Low: frontend supply-chain visibility** — CI now runs `npm audit --audit-level=high` before the
  existing frontend quality gates.

## Security assessment

Password hashing uses Argon2id through `pwdlib`; JWTs use an explicitly configured 32-character
minimum signing secret and expiry. Authentication uses bearer tokens held only in React memory, so a
page refresh signs the user out but tokens are not persisted in `localStorage`. This reduces exposure
to persistent XSS token theft. The backend, not the UI, checks user roles and stock.

SQLAlchemy expressions parameterize query inputs; no user input is concatenated into SQL. CORS is an
explicit environment-configured allow-list. The project is not penetration-tested and does not yet have
authentication rate limiting.

## Known limitations

- Python dependencies are not installed locally because PyPI access timed out; backend test, Ruff,
  mypy, migration, and PostgreSQL concurrency results are therefore unverified locally.
- PostgreSQL is required to prove atomic purchase behavior under concurrent connections; no local
  PostgreSQL server, `psql`, or Docker runtime is available.
- The Phase 3 dedicated administrator add/edit/delete workspace is still incomplete. Server-side admin
  authorization is present, but this should be the next UI slice once the backend is executable.
- Browser inspection verified the inventory, filters, stock disabling, and details dialog; it did not
  verify live API mutation flows without a running backend.

## Reproducible checks

```powershell
cd frontend
npm ci
npm audit --audit-level=high
npm run lint
npm run format:check
npm test
npm run build
```

CI runs the same frontend commands, plus its PostgreSQL-backed backend checks after dependencies can
be installed.
