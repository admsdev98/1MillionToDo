# BACK-CARD-004: implement owned tasks crud with strict multi-tenancy

**Type**: feature
**Priority**: high
**Status**: completed
**Sprint**: 01
**Created**: 2026-02-28
**Completed**: 2026-02-28

## Goal
Implement owned-task CRUD with strict per-user isolation (multi-tenancy) and PATCH updates.

## Context
- Sprint 01 covers owned tasks only so the core flow can be verified end-to-end.
- Sharing and shared-recipient read-only rules move to Sprint 02.

## Scope (in)
- `GET /v1/tasks` (list tasks owned by the authenticated user).
- `POST /v1/tasks` (create owned task).
- `GET /v1/tasks/:id` (owner-only).
- `PATCH /v1/tasks/:id` (owner-only; PATCH only).
- `DELETE /v1/tasks/:id` (owner-only).

## Scope (out)
- Task sharing endpoints and shared task visibility (Sprint 02).
- Plan-based caps and rate limiting (Sprint 02).

## Steps
1. Implement `tasks.routes.js` with CRUD handlers and Fastify schemas.
2. Enforce multi-tenancy by always scoping queries with `owner_user_id = request.user.id`.
3. Implement PATCH as partial update (only update provided fields).
4. Ensure list returns stable ordering (e.g., newest first).

## Acceptance criteria
- [x] User A cannot read/update/delete User B tasks.
- [x] All write endpoints require a valid JWT.
- [x] Updates use PATCH (no PUT route).
- [x] Invalid payloads return 400 with a consistent error shape.

## Evidence
- `POST /v1/tasks` with User A token created an owned task: `{"id":"420f3146-a34e-4f3d-8904-b7c02a9dbc17", ...}`.
- `GET /v1/tasks/:id` with User A token returned `200`, while the same request with User B token returned `404 Task not found`.
- `PATCH /v1/tasks/:id` with User A token succeeded and returned `{"is_completed":true,...}`.
- `DELETE /v1/tasks/:id` with User B token returned `404`; with User A token returned `204 No Content`.
- `POST /v1/tasks` without JWT returned `401 Unauthorized`.
- `PUT /v1/tasks/:id` returned `404` (`Route PUT ... not found`), confirming PATCH-only updates.
- Invalid PATCH payload returned `HTTP/1.1 400` with consistent shape: `{"error":{"code":"BAD_REQUEST","message":"At least one field must be provided"}}`.
- `GET /v1/tasks` ordering check returned newest task first (`Order task 2` before `Order task 1`).

## Evidence to attach when completed
- `curl` walkthrough showing two users cannot access each other's tasks.
- Example response for a successful PATCH update.

## Risks
- Accidentally trusting a client-provided `userId` (must always use JWT subject).
- PATCH edge cases (empty body; unknown fields) can lead to silent failures.

## Test / verify commands (suggested; do not run here)
- `curl -s http://localhost:3000/v1/tasks -H "Authorization: Bearer $TOKEN"`
- `curl -s -X POST http://localhost:3000/v1/tasks -H 'content-type: application/json' -H "Authorization: Bearer $TOKEN" -d '{"title":"Buy milk"}'`
- `curl -s -X PATCH http://localhost:3000/v1/tasks/$TASK_ID -H 'content-type: application/json' -H "Authorization: Bearer $TOKEN" -d '{"is_completed":true}'`

## Implementation notes

**Approach chosen**: Implemented owner-scoped SQL for every task query (`owner_user_id` from JWT claims), plus explicit PATCH field handling with controlled dynamic SQL updates.
**Alternatives considered**:
- Accept client-provided user IDs in request bodies: discarded because strict multi-tenancy must always derive identity from JWT.
- Build a generic query builder helper: discarded because this card only needs one clear PATCH builder and avoiding extra abstractions keeps it simpler.
**Key commands run**: `curl -s -X POST http://localhost:3001/v1/tasks ...` -> owned task created; `curl -s -i -X GET http://localhost:3001/v1/tasks/$TASK_ID ...UserB...` -> 404 blocked cross-user read; `curl -s -i -X PATCH http://localhost:3001/v1/tasks/$TASK_ID -d '{"unknown_field":true}' ...` -> 400 consistent error shape.
