# BACK-CARD-004: tasks crud with multi-tenancy and task sharing

**Type**: feature
**Priority**: high
**Status**: pending
**Sprint**: 01

## Goal
Implement tasks CRUD and sharing with strict access checks.

## Scope
- `GET /v1/tasks`
- `POST /v1/tasks`
- `GET /v1/tasks/:id`
- `PATCH /v1/tasks/:id`
- `DELETE /v1/tasks/:id`
- `POST /v1/tasks/:id/share`
- `DELETE /v1/tasks/:id/share/:userId`

## Rules
- Owner: full access.
- Shared recipient: read-only.

## Acceptance criteria
- [ ] User A cannot access User B tasks unless shared.
- [ ] Shared tasks appear in list and are marked as shared.
- [ ] Shared recipients cannot edit/delete.
- [ ] Updates use PATCH.
