# FRONT-CARD-022: add dashboard modals, edit/delete, status, settings, and help

**Type**: feature
**Priority**: high
**Status**: cancelled
**Sprint**: 04
**Created**: 2026-02-28

## Goal
Complete the dashboard UX: editable tasks (owned), status badge, due date, tag, optional share, settings, and a help panel.

## Context
- The API already supports edit/delete for owned tasks and sharing via a separate endpoint.
- Sprint 04 adds due_date and tag to tasks.
- Settings should allow changing plan and viewing request logs.

## Scope (in)
- Task cards:
  - Add action buttons (Edit/Delete) for owned tasks.
  - Show a status badge (Open/Done/Overdue) and an access badge (Owned/Shared).
- Modal editor:
  - Clicking a task opens a modal with inputs: title, description, due date (date-only), tag.
  - Buttons: Save (PATCH), Delete (DELETE), Close.
  - Shared tasks are read-only in the modal.
- Create task:
  - Include due date, tag, and optional share email.
  - If share email is provided, call share endpoint after task creation.
- Settings:
  - Add a Settings entry/button.
  - Allow updating plan (`PATCH /v1/me/plan`).
  - Show recent request logs (`GET /v1/me/request-logs`).
- Help:
  - Add a floating help button.
  - Show instructions and (if available) debug users list.

## Scope (out)
- Managing share recipients list (no endpoint exists today).
- Unshare UI.
- Advanced filtering.

## Steps
1. Implement a reusable modal component (no dependencies).
2. Wire task edit/save/delete flows to existing endpoints.
3. Add due date and tag inputs consistent with the new API.
4. Add settings drawer/modal and request logs viewer.
5. Add help floating panel.

## Acceptance criteria
- [ ] Owned tasks can be edited and deleted from the UI.
- [ ] Shared tasks remain read-only and show clear badges.
- [ ] Due date and tag can be set on create and edit.
- [ ] Optional share by email works (create then share).
- [ ] Settings can update plan and display recent request logs.
- [ ] Help panel shows instructions and lists users/plans when debug endpoint is enabled.

## Evidence to attach when completed
- Screenshots of dashboard, modal editor, settings, and help panel.

## Superseded by
- `docs/exec-plans/pending/FRONT-CARD-023-add-task-detail-modal-with-edit-delete-and-share.md`
- `docs/exec-plans/pending/FRONT-CARD-024-show-task-status-tag-and-due-date-in-task-cards.md`
- `docs/exec-plans/pending/FRONT-CARD-025-upgrade-create-task-form-with-due-date-tag-and-share-email.md`
- `docs/exec-plans/pending/FRONT-CARD-026-add-settings-route-with-plan-and-request-logs.md`
- `docs/exec-plans/pending/FRONT-CARD-027-add-floating-help-panel-for-demo-users-and-sharing.md`

## Cancellation reason
This card was too large for one implementation pass and violated the one-card-at-a-time workflow, so it was split into focused Sprint 05 cards.
