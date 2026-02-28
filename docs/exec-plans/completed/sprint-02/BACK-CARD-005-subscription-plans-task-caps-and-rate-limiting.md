# BACK-CARD-005: subscription plans, task caps, and rate limiting

**Type**: feature
**Priority**: medium
**Status**: completed
**Sprint**: 02
**Created**: 2026-02-28
**Completed**: 2026-02-28

## Goal
Implement plan-based task caps and rate limiting using locked values, with plan decisions resolved from database state on each request path.

## Context
- Plans are stored on the `users.plan` column and are the source of truth.
- JWT `plan` claims can become stale after plan changes; do not use JWT `plan` for enforcement.
- Rate limiting must be per authenticated user (JWT) and per IP for unauthenticated routes.
- No new dependencies are planned; use a simple in-memory limiter.

## Plans (locked)
- free: 10 owned tasks
- premium: 30 owned tasks
- enterprise: 100 owned tasks

## Rate limiting (defaults)
- free: 30 req/min
- premium: 120 req/min
- enterprise: 600 req/min

## Scope (in)
- Enforce owned-task caps on `POST /v1/tasks` based on plan read from DB.
- Add a small demo endpoint to view/update plan (e.g., `GET /v1/me`, `PATCH /v1/me/plan`).
- Apply rate limiting:
  - per-user for authenticated requests
  - per-IP for unauthenticated requests

## Error contract (locked)
- `PLAN_LIMIT_REACHED` -> 403
- `RATE_LIMITED` -> 429
- Error response shape: `{ "error": { "code": "...", "message": "..." } }`

## Scope (out)
- Persistent distributed rate limiting (no Redis).
- Billing integrations.

## Steps
1. Implement a `plan-limits.js` helper defining caps and per-minute limits.
2. Implement a rate limiting plugin/hook that resolves plan from DB for authenticated users (or IP for unauth requests).
3. Enforce task cap in task creation by counting owned tasks in the database and comparing with DB plan.
4. Add small account endpoints to inspect and change the plan for demo purposes.

## Acceptance criteria
- [x] Creating tasks enforces caps based on plan resolved from DB (not JWT claim).
- [x] Rate limiting triggers based on plan resolved from DB for authenticated users.
- [x] Limits apply per userId (auth) and per IP (unauth).
- [x] Cap and rate-limit failures return stable contract errors: `PLAN_LIMIT_REACHED` (403) and `RATE_LIMITED` (429).

## Evidence to attach when completed
- `curl` examples showing:
  - free user hits cap and receives `PLAN_LIMIT_REACHED` with HTTP 403
  - rate limit returns `RATE_LIMITED` with HTTP 429 after exceeding per-minute budget
  - plan change via `PATCH /v1/me/plan` affects enforcement without issuing a new JWT

## Evidence
- Task cap hit (403 + `PLAN_LIMIT_REACHED`): `docs/exec-plans/completed/sprint-02/evidence/api/s02-cap-limit.txt`
- Plan upgrade without new JWT allows creating again (201): `docs/exec-plans/completed/sprint-02/evidence/api/s02-cap-after-upgrade.txt`
- Rate limited (429 + `RATE_LIMITED` + `retry-after`): `docs/exec-plans/completed/sprint-02/evidence/api/s02-rate-limited.txt`
- Enterprise plan supports higher rate budget (80 requests to `/v1/me` all 200): `docs/exec-plans/completed/sprint-02/evidence/api/s02-enterprise-rate-results.txt`
- Plan endpoints output examples: `docs/exec-plans/completed/sprint-02/evidence/api/s02-plan-premium.json`, `docs/exec-plans/completed/sprint-02/evidence/api/s02-plan-enterprise.json`
- Code refs:
  - Plan tables: `backend/src/lib/plan-limits.js`
  - In-memory limiter: `backend/src/plugins/rate-limit.js`
  - Account endpoints: `backend/src/v1/routes/me/me.routes.js`
  - Cap enforcement on task create: `backend/src/v1/routes/tasks/tasks.routes.js`

## Risks
- In-memory rate limiting resets on restart (acceptable for assessment, but must be documented).
- Counting tasks on every create can be slow without indexes (ensure `idx_tasks_owner_user_id`).

## Test / verify commands (suggested; do not run here)
- `curl -i -X PATCH http://localhost:3000/v1/me/plan -H 'content-type: application/json' -H "Authorization: Bearer $TOKEN" -d '{"plan":"premium"}'`
- `for i in {1..40}; do curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/v1/tasks -H 'content-type: application/json' -H "Authorization: Bearer $TOKEN" -d '{"title":"t"}'; done`
