# BACK-CARD-004: implement owned tasks crud with strict multi-tenancy

**Type**: feature
**Priority**: high
**Status**: pending
**Sprint**: 01
**Created**: 2026-02-28

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
- [ ] User A cannot read/update/delete User B tasks.
- [ ] All write endpoints require a valid JWT.
- [ ] Updates use PATCH (no PUT route).
- [ ] Invalid payloads return 400 with a consistent error shape.

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
