# TDD log

## 2026-10-25 — Health endpoint

### Red

Added `backend/tests/test_health.py` first. It specifies that `GET /health` returns status 200 and the
JSON document `{\"status\": \"ok\"}`.

Command run from the repository root:

```text
py -3.12 -m pytest backend/tests/test_health.py -q
```

Actual result: exit code 1.

```text
No installed Python found!
```

This is an environment prerequisite failure rather than the expected missing-application import
failure. It is preserved verbatim so the unavailable runtime is not misrepresented as a test result.

### Green

Added the minimal FastAPI route, response schema, service, application factory, and explicit test
configuration. A bundled Python 3.12.14 runtime was later found and syntax compilation passed, but
the test could not execute because repeated PyPI dependency installation attempts timed out. CI is
configured to run it under Python 3.12 with PostgreSQL.

