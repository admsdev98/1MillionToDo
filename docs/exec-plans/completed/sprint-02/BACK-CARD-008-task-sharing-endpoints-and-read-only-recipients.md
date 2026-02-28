# BACK-CARD-008: task sharing endpoints and read-only recipients

**Type**: feature
**Priority**: medium
**Status**: completed
**Sprint**: 02
**Created**: 2026-02-28
**Completed**: 2026-02-28

## Goal
Add task sharing via a join table so recipients can read shared tasks but cannot edit/delete/share them.

## Context
- The schema includes `task_shares(task_id, user_id)`.
- Sharing changes access checks across multiple routes; keeping it in Sprint 02 reduces Sprint 01 risk.

## Scope (in)
- Make shared tasks visible in `GET /v1/tasks` for the recipient.
- Use `access` marker in task payloads with enum values: `owner` or `shared`.
- Add share management endpoints (owner-only):
  - `POST /v1/tasks/:id/share` (share with another user)
  - `DELETE /v1/tasks/:id/share/:userId` (remove share)
- Enforce permissions:
  - owner: full access
  - shared recipient: read-only (GET only)

## Scope (out)
- Sharing with anonymous emails (must be an existing user).
- Fine-grained permissions beyond read-only.

## Contract notes (locked)
- Do not introduce `isShared` or other camelCase flags.
- Shared marker is `access: "owner" | "shared"`.
- Read-only violations must return stable error contract:
  - `TASK_SHARED_READ_ONLY` -> 403

## Steps
1. Decide share input contract (recommended: `{ email }` to look up recipient user id; document in route schema).
2. Update task list query to include:
   - owned tasks
   - tasks shared with the user
3. Add `access` field mapping in both task list and task-by-id responses.
4. Add an access helper used by:
   - `GET /v1/tasks/:id`
   - `PATCH /v1/tasks/:id`
   - `DELETE /v1/tasks/:id`
   - share endpoints
5. For shared tasks, block PATCH/DELETE/share with 403 and `TASK_SHARED_READ_ONLY`.

## Acceptance criteria
- [x] Recipient can see shared tasks in list and fetch them by id.
- [x] Shared tasks expose `access: "shared"`; owned tasks expose `access: "owner"`.
- [x] Recipient cannot PATCH/DELETE/share a shared task and gets `TASK_SHARED_READ_ONLY` (403).
- [x] Owner can add/remove shares.
- [x] Sharing does not allow cross-tenant access unless explicitly shared.

## Evidence to attach when completed
- `curl` walkthrough with two users showing share + recipient read-only behavior.
- Example list response showing `access: "shared"`.

## Evidence
- Share endpoint returns 201: `docs/exec-plans/completed/sprint-02/evidence/api/s02-share.txt`
- Recipient list shows `access: "shared"`: `docs/exec-plans/completed/sprint-02/evidence/api/s02-recipient-list.json`
- Recipient PATCH blocked with 403 + `TASK_SHARED_READ_ONLY`: `docs/exec-plans/completed/sprint-02/evidence/api/s02-recipient-patch.txt`
- Code refs:
  - Sharing routes: `backend/src/v1/routes/tasks/task-sharing.routes.js`
  - Tasks access checks and `access` marker: `backend/src/v1/routes/tasks/tasks.routes.js`

## Risks
- Access control mistakes are the highest-risk part of the assessment.
- Query complexity can cause duplicates (owned + shared) unless handled carefully.

## Test / verify commands (suggested; do not run here)
- `curl -s -X POST http://localhost:3000/v1/tasks/$TASK_ID/share -H 'content-type: application/json' -H "Authorization: Bearer $OWNER_TOKEN" -d '{"email":"b@example.com"}'`
- `curl -i -X PATCH http://localhost:3000/v1/tasks/$TASK_ID -H 'content-type: application/json' -H "Authorization: Bearer $RECIPIENT_TOKEN" -d '{"title":"should-fail"}'`
