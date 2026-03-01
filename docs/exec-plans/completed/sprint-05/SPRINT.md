# Sprint 05: final dashboard and settings UI delivery

**Status**: completed
**Started**: 2026-02-28
**Completed**: 2026-02-28
**Goal**: Deliver the missing ToDo UI functionality for task details/edit/delete/share, richer previews and create form, settings route, and floating help panel.

## Canonical source
- This file is the canonical Sprint 05 plan.
- Sprint 04 history is archived in `docs/exec-plans/completed/sprint-04/SPRINT.md`.

## Scope
- Frontend-only UX completion for dashboard and settings routes.
- No new dependencies.
- Use current backend endpoints as-is.

## Cards
- [x] FRONT-CARD-023: add task detail modal with edit, delete, and share
- [x] FRONT-CARD-024: show task status, tag, and due date in task cards
- [x] FRONT-CARD-025: upgrade create task form with due date, tag, and share email
- [x] FRONT-CARD-026: add settings route with plan and request logs
- [x] FRONT-CARD-027: add floating help panel for demo users and sharing

## Recommended execution order
1. FRONT-CARD-023
2. FRONT-CARD-024
3. FRONT-CARD-025
4. FRONT-CARD-026
5. FRONT-CARD-027

## Definition of done
- Task cards are clickable and open a detail modal.
- Owned tasks can be edited, deleted, and shared by email from the modal.
- Shared tasks are clearly read-only in cards and modal.
- Task previews show status (Open/Done/Overdue), tag, and due date.
- Create task flow supports description textarea, due date, tag, and optional share email with partial-success feedback.
- `/app/settings` route is auth-gated and supports plan updates and request log viewing.
- Dashboard includes a floating help panel that tries `/v1/debug/users` and degrades gracefully when unavailable.
- Each completed card includes evidence under `docs/exec-plans/completed/sprint-05/evidence/`.

## Manual regression checklist
- Login -> dashboard -> create/edit/delete/share task still works.
- Shared task remains read-only in list and modal.
- Settings route loads, updates plan, and renders request logs.
- Help panel opens/closes and handles debug endpoint unavailable state.
