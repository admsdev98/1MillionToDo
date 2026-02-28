# BACK-CARD-020: add request logs endpoint and dev user list

**Type**: feature
**Priority**: medium
**Status**: completed
**Sprint**: 04
**Created**: 2026-02-28
**Started**: 2026-02-28
**Completed**: 2026-02-28

## Goal
Support in-app viewing of recent request logs and provide a safe dev-only user list for the help panel.

## Context
- Request logs exist today only in stdout (`request-logger` plugin).
- The Sprint 04 settings screen wants to show recent requests.
- The help panel wants a list of users and their plans for demo.

## Scope (in)
- Add `GET /v1/me/request-logs` (auth required):
  - returns last N records (e.g. 50) for the authenticated user
  - in-memory storage is acceptable (demo)
- Add dev-only endpoint `GET /v1/debug/users` guarded by `ALLOW_DEBUG_ENDPOINTS=1`:
  - returns safe fields only (`id`, `email`, `plan`, timestamps)
  - must never return password hashes/salts
- Optional: dev-only `POST /v1/debug/seed-demo-users` to create a few demo accounts.

## Scope (out)
- Persist logs in Postgres.
- Real admin roles.

## Steps
1. Extend request logger to capture userId (when present) and write to a per-user ring buffer.
2. Implement `GET /v1/me/request-logs`.
3. Implement debug guard flag and the user list endpoint.
4. Add curl evidence.

## Acceptance criteria
- [x] `GET /v1/me/request-logs` returns an array of recent requests for the caller.
- [x] Logs include URL, method, timestamp, execution time, and status code.
- [x] Debug endpoints return 404 unless `ALLOW_DEBUG_ENDPOINTS=1`.
- [x] Debug endpoints never leak sensitive auth data.

## Evidence to attach when completed
- Curl output for logs.
- Curl output showing debug endpoint gating.

## Evidence
- Request logs response: `docs/exec-plans/completed/sprint-04/evidence/api/s04-me-request-logs.txt`
- Debug users disabled (404): `docs/exec-plans/completed/sprint-04/evidence/api/s04-debug-users-disabled.txt`
- Debug users enabled (200): `docs/exec-plans/completed/sprint-04/evidence/api/s04-debug-users-enabled.txt`

## Code refs
- In-memory per-user log buffer: `backend/src/plugins/request-logger.js`
- Logs endpoint: `backend/src/v1/routes/me/me.routes.js`
- Debug users + demo seeding (gated): `backend/src/v1/routes/debug/debug.routes.js`
- Flag config: `backend/src/config.js`
- Registration gating in app: `backend/src/app.js`
