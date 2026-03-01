# FRONT-CARD-030: add dashboard due date filters UI

**Type**: feature
**Priority**: high
**Status**: pending
**Sprint**: 06
**Created**: 2026-03-01

## Goal
Let users filter the task list by an inclusive due-date range (days) from the dashboard UI.

## Context (file paths)
- Dashboard rendering + loadTasks flow: `frontend/public/views/dashboard-view.js`
- Tasks API wrapper (currently no query support): `frontend/public/features/tasks/tasks-api.js`
- Shared translations (add filter labels/messages): `frontend/public/shared/i18n.js`
- Styles (layout + responsive): `frontend/public/app.css`

## Scope (in)
- Add a compact due-date filter row on `/app` with:
  - `Due from` date input
  - `Due to` date input
  - Apply button
  - Clear button
- Update the dashboard list load to call `GET /v1/tasks` with `due_from` / `due_to` when set.
- Validate the range client-side (if both are present, block apply when `due_from > due_to` and show a clear banner error).
- Ensure the filter UI works in ES (default) and EN (alternate).

## Scope (out)
- Saved filters across sessions.
- Complex presets ("today", "next 7 days") unless it stays truly minimal.

## Steps
1. Update `frontend/public/features/tasks/tasks-api.js` so `listTasks` can accept optional `{ due_from, due_to }` and build a query string safely.
2. Add filter UI elements to `frontend/public/views/dashboard-view.js` near the task list heading.
3. Keep a small in-memory filter state in the dashboard view and reload the list on Apply.
4. Implement Clear to reset inputs, clear filter state, and reload the unfiltered list.
5. Add i18n keys for labels/buttons and one validation banner message (ES + EN).
6. Adjust CSS so the filter row is usable on narrow screens.

## Acceptance criteria
- [ ] Dashboard shows a due-date filter UI with from/to date inputs and Apply/Clear actions.
- [ ] Applying a valid range calls `GET /v1/tasks` with `due_from`/`due_to` and updates the list.
- [ ] Clearing filters reloads the full list (no query params).
- [ ] If both bounds are set and `from > to`, the UI blocks applying and shows a banner error (no API call).
- [ ] Filter labels and banner message render correctly in ES and EN.

## Evidence required
- Manual verification notes: `docs/exec-plans/completed/sprint-06/evidence/ui/s06-front-card-030-due-filters-manual-check.md`
- Screenshot showing the filter row (mobile width): `docs/exec-plans/completed/sprint-06/evidence/ui/s06-front-card-030-due-filters-mobile.png`

## Risks
- Backend excludes `due_date = null` when filters are active; ensure UI messaging does not imply "all tasks" when filtering.
- HTML date inputs vary by browser; keep expectations limited to value presence and ordering.

## Verify commands
- `node --check frontend/public/features/tasks/tasks-api.js`
- `node --check frontend/public/views/dashboard-view.js`
