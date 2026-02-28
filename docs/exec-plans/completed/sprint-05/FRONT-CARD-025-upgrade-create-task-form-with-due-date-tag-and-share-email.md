# FRONT-CARD-025: upgrade create task form with due date, tag, and share email

**Type**: feature
**Priority**: high
**Status**: completed
**Sprint**: 05
**Created**: 2026-02-28
**Started**: 2026-02-28
**Completed**: 2026-02-28

## Goal
Make task creation complete enough for the demo flow.

## Context
- Current create form only supports title and basic description.
- Sprint scope needs due date, tag, and optional share-on-create.

## Scope (in)
- Use a description textarea in create form.
- Add `due_date` and `tag` inputs.
- Add optional share email field.
- Create flow: `POST /v1/tasks`, then optional `POST /v1/tasks/:id/share`.
- Show a clear partial-success banner if create succeeds but share fails.

## Scope (out)
- Multi-recipient sharing.
- Atomic create+share endpoint.

## Steps
1. Update create form UI and payload shape.
2. Add optional share step after successful create.
3. Show success/error/partial-success banner messages.

## Acceptance criteria
- [x] Create form includes description textarea, due date, tag, and optional share email.
- [x] New task creation sends `due_date` and `tag` when provided.
- [x] Optional share runs only after successful task creation.
- [x] Partial success banner appears when share fails after create.

## Evidence to attach when completed
- Manual verification notes and key files changed.

## Evidence
- `docs/exec-plans/completed/sprint-05/evidence/ui/s05-card-025-create-form-upgrade-manual-check.md`

## Code refs
- `frontend/public/views/dashboard-view.js`
- `frontend/public/features/tasks/tasks-api.js`
- `frontend/public/app.css`

## Implementation notes

**Approach chosen**: Extended the existing create form with due date/tag/share fields and kept the flow explicit: create first, then optional share call with clear success or warning banners.
**Alternatives considered**:
- Add a new atomic backend endpoint for create-and-share: discarded because existing endpoints already support the flow and adding API surface is unnecessary.
- Hide partial failures and only show generic success: discarded because users need clear feedback when share fails but task creation succeeds.
**Key commands run**: `node --check frontend/public/features/tasks/tasks-api.js && node --check frontend/public/views/dashboard-view.js` -> syntax checks passed; Playwright `/app` form flow validated warning banner on missing recipient and success banner on valid recipient share.
