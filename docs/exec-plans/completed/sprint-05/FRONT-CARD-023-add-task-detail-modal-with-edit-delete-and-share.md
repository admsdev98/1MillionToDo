# FRONT-CARD-023: add task detail modal with edit, delete, and share

**Type**: feature
**Priority**: high
**Status**: completed
**Sprint**: 05
**Created**: 2026-02-28
**Started**: 2026-02-28
**Completed**: 2026-02-28

## Goal
Allow users to open any task card and manage owned tasks from a modal.

## Context
- Dashboard currently lists tasks but does not allow opening a detail modal.
- Owners need edit/delete/share actions; shared recipients must stay read-only.

## Scope (in)
- Make task cards clickable to open a task detail modal.
- Modal fields: title, description, due date, tag, access badge.
- Owned tasks: Save (`PATCH`), Delete (`DELETE`), Share by email (`POST /v1/tasks/:id/share`).
- Shared tasks: read-only fields and no save/delete/share actions.

## Scope (out)
- Share recipients list management.
- Unshare flow.

## Steps
1. Add task-card click handling and open/close modal behavior.
2. Render modal fields from selected task.
3. Wire save/delete/share API actions for owner tasks.
4. Keep shared tasks explicitly read-only.

## Acceptance criteria
- [x] Clicking a task opens a detail modal.
- [x] Owner task modal can save updates with PATCH.
- [x] Owner task modal can delete a task.
- [x] Owner task modal can share by email.
- [x] Shared task modal is read-only.

## Evidence to attach when completed
- Manual verification notes and key files changed.

## Evidence
- `docs/exec-plans/completed/sprint-05/evidence/ui/s05-card-023-task-modal-manual-check.md`

## Code refs
- `frontend/public/views/dashboard-view.js`
- `frontend/public/features/tasks/task-card.js`
- `frontend/public/features/tasks/tasks-api.js`
- `frontend/public/app.css`

## Implementation notes

**Approach chosen**: Added an explicit task detail modal rendered from dashboard state and wired owner actions (patch, delete, share) directly to existing endpoints while keeping shared tasks read-only.
**Alternatives considered**:
- Separate modal component module: discarded because the modal is only used by dashboard and inline code keeps this MVP easier to follow.
- New combined backend endpoint for edit/share: discarded because existing endpoints already cover the flow.
**Key commands run**: `node --check frontend/public/features/tasks/tasks-api.js && node --check frontend/public/features/tasks/task-card.js && node --check frontend/public/views/dashboard-view.js` -> syntax checks passed; Playwright manual flow on `/app` -> owner modal actions and shared read-only behavior validated.
