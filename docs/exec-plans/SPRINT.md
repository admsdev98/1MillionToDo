# Sprint 06: navigation fixes, due date filters, and mobile UX polish

**Status**: planning
**Started**: 2026-03-01
**Goal**: Tighten routing/navigation behavior, add due-date range filtering to tasks, and improve the mobile header + responsive layout.

## What's included
- Redirect authenticated users from `/` to `/app`, and simplify app navigation (no Home/Inicio link).
- Add `due_from` / `due_to` filters to `GET /v1/tasks` (inclusive, validated).
- Add dashboard UI controls for due-date filtering.
- Replace app-page header nav with a mobile hamburger menu.
- Mobile responsive audit + targeted fixes across all routes.

## What's NOT included
- New dependencies or build tooling.
- Pagination/sorting redesign for tasks.
- Major visual redesign of landing/auth pages.

## Cards
- [ ] FRONT-CARD-028: redirect authenticated root to app and remove home link
- [ ] BACK-CARD-029: add due date filters to list tasks endpoint
- [ ] FRONT-CARD-030: add dashboard due date filters UI
- [ ] FRONT-CARD-031: add mobile hamburger menu to app header
- [ ] FRONT-CARD-032: mobile responsive audit and fixes

## Recommended execution order
1. FRONT-CARD-028
2. BACK-CARD-029
3. FRONT-CARD-030
4. FRONT-CARD-031
5. FRONT-CARD-032

## Notes
- Sprint 05 is archived at `docs/exec-plans/completed/sprint-05/SPRINT.md`.
