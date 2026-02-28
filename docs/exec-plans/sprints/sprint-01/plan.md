# Sprint 01 plan (archived)

NOTE: The canonical sprint file is `docs/exec-plans/SPRINT.md`. `docs/exec-plans/SPRINT-02-PREVIEW.md` is deprecated and kept only for history.

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

## Cards (updated)

Sprint 01 (max 6):
- DB-CARD-001: create Postgres schema
- BACK-CARD-002: bootstrap Fastify app + db + jwt + request logger
- BACK-CARD-003: implement register/login (JWT)
- BACK-CARD-004: implement owned tasks CRUD (multi-tenancy)

Sprint 02 (preview, max 6):
- BACK-CARD-005: subscription plans, task caps, and rate limiting
- BACK-CARD-007: password reset demo flow
- BACK-CARD-008: task sharing + read-only recipients
- FRONT-CARD-006: minimal UI
- DOCS-CARD-009: bilingual run instructions + API examples
- BACK-CARD-010: hardening
