# Interview guide

Use these answers only alongside the cited source; they are grounded in the current workspace and its
documented limitations.

| Topic | Concise answer | Open | Follow-up to expect | Technical point |
| --- | --- | --- | --- | --- |
| Architecture | I chose a modular monolith: routes translate HTTP, services contain rules, SQLAlchemy persists data. It is simple enough for the domain today. | `backend/app/api/routes/vehicles.py`, `backend/app/services/vehicles.py` | Why not repositories? | There was no repeated persistence abstraction yet. |
| Red–Green–Refactor | I wrote the health and vehicle-card specifications before their implementations. The recorded red run is real; later frontend tests passed. | `docs/TDD_LOG.md`, `frontend/src/components/VehicleCard.test.tsx` | Did every test run? | No: Python dependencies blocked backend execution. |
| Purchase concurrency | Purchase is a conditional SQL update requiring stock above zero, avoiding a separate read-then-write race. | `backend/app/services/vehicles.py` | How did you prove it? | I have not yet proved it under PostgreSQL concurrency; that is a release blocker. |
| Authorization | Authentication identifies a token holder; authorization checks the current database user's role before admin endpoints. | `backend/app/api/deps.py` | Why use DB role rather than JWT role? | Database role is current even after a token was issued. |
| AI use | AI accelerated scaffolding and diagnosis, but I kept actual failures and limitations in the record. | `PROMPTS.md`, `docs/ENGINEERING_REVIEW.md` | What did AI get wrong? | It could not make unavailable backend checks pass; claims were corrected to evidence. |

## Trade-offs under time constraints

The frontend uses memory-only bearer-token storage: lower persistence risk, but refresh logs out. The
dashboard includes clearly labelled preview vehicles so the UI remains inspectable before a backend runs.
The dedicated admin workspace and full PostgreSQL integration test suite remain the next priority.
