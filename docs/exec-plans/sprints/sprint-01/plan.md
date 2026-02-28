# Sprint 01 plan (informational)

Goal: ship a runnable MVP quickly, starting with a minimal backend so the frontend uses real endpoints.

## Why this order
- Backend first avoids frontend mock code and reduces spaghetti.
- Once auth + tasks exist, UI can be built and verified end-to-end.

## Plan limits (locked)
Plans:
- free: 10 owned tasks
- premium: 30 owned tasks
- enterprise: 100 owned tasks

Rate limiting (coherent defaults):
- free: 30 requests/minute
- premium: 120 requests/minute
- enterprise: 600 requests/minute

Notes:
- Task caps apply to owned tasks only (shared tasks do not count against the cap).
- Rate limiting is per authenticated user; unauth routes use IP-based limiting.

## Cards in this sprint (max 6)
- DB-CARD-001: create Postgres schema
- BACK-CARD-002: bootstrap Fastify app + db + jwt + request logger
- BACK-CARD-003: implement auth + password reset demo flow
- BACK-CARD-004: implement tasks CRUD + sharing + access checks
- BACK-CARD-005: implement plan caps + rate limiting + subscription endpoints
- FRONT-CARD-006: implement minimal UI (login, dashboard, settings)
