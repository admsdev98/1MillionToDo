# BACK-CARD-005: subscription plans, task caps, and rate limiting

**Type**: feature
**Priority**: medium
**Status**: pending
**Sprint**: 02
**Created**: 2026-02-28

## Goal
Implement plan-based task caps and rate limiting using the locked plan values.

## Context
- Plans are stored on the `users.plan` column.
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
- Enforce owned-task caps on `POST /v1/tasks` based on the caller's plan.
- Add a small demo endpoint to view/update plan (e.g., `GET /v1/me`, `PATCH /v1/me/plan`).
- Apply rate limiting:
  - per-user for authenticated requests
  - per-IP for unauthenticated requests

## Scope (out)
- Persistent distributed rate limiting (no Redis).
- Billing integrations.

## Steps
1. Implement a `plan-limits.js` helper defining caps and per-minute limits.
2. Implement a rate limiting plugin/hook that reads user plan (or IP) and enforces limits.
3. Enforce task cap in task creation by counting owned tasks in the database.
4. Add small account endpoints to inspect and change the plan for demo purposes.

## Acceptance criteria
- [ ] Creating tasks enforces caps based on plan.
- [ ] Rate limiting triggers based on plan.
- [ ] Limits apply per userId (auth) and per IP (unauth).

## Evidence to attach when completed
- `curl` examples showing:
  - free user hits cap and receives a clear error code
  - rate limit returns 429 after exceeding per-minute budget

## Risks
- In-memory rate limiting resets on restart (acceptable for assessment, but must be documented).
- Counting tasks on every create can be slow without indexes (ensure `idx_tasks_owner_user_id`).

## Test / verify commands (suggested; do not run here)
- `curl -i -X PATCH http://localhost:3000/v1/me/plan -H 'content-type: application/json' -H "Authorization: Bearer $TOKEN" -d '{"plan":"premium"}'`
- `for i in {1..40}; do curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/v1/tasks -H 'content-type: application/json' -H "Authorization: Bearer $TOKEN" -d '{"title":"t"}'; done`
