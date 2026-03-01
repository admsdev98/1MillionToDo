# BACK-CARD-029: add due date filters to list tasks endpoint

**Type**: feature
**Priority**: high
**Status**: completed
**Sprint**: 06
**Created**: 2026-03-01
**Started**: 2026-03-01
**Completed**: 2026-03-01

## Goal
Extend `GET /v1/tasks` to support inclusive due-date range filtering via `due_from` and `due_to` query params.

## Context (file paths)
- Tasks routes + SQL: `backend/src/v1/routes/tasks/tasks.routes.js`
- Due date is a date-only column: `db/migrations/002-add-due-date-and-tag-to-tasks-table.sql`
- Prior due_date validation decisions: `docs/exec-plans/completed/sprint-04/BACK-CARD-019-support-due-date-and-tag-in-task-endpoints.md`

## Scope (in)
- Add optional query params to `GET /v1/tasks`:
  - `due_from` (inclusive lower bound)
  - `due_to` (inclusive upper bound)
- Validate input:
  - Each param must be a valid `YYYY-MM-DD` date (Fastify schema format `date`).
  - If both are present, enforce `due_from <= due_to`; otherwise return 400 with the standard error shape.
- Apply the filter using `tasks.due_date` as the primary field:
  - When any due filter is present, only return tasks with a non-null `due_date` that matches the range.
- Preserve existing multi-tenancy and sharing behavior (owned + shared tasks still included when they match the due date filter).

## Scope (out)
- Sorting changes.
- Pagination.
- Filtering by `created_at` (only add if it is truly minimal and does not dilute due-date work).

## Steps
1. Add a `querystring` schema for `GET /v1/tasks` supporting `due_from` and `due_to` with `format: "date"`.
2. Implement explicit validation for `due_from <= due_to` when both are present (schema alone will not enforce ordering).
3. Update the SQL WHERE clause to add optional, parameterized conditions for `tasks.due_date`:
   - `tasks.due_date >= $X` when `due_from` is present
   - `tasks.due_date <= $Y` when `due_to` is present
   - Ensure tasks with `due_date IS NULL` are excluded when any due filter is active.
4. Keep existing access marker behavior (`access: owner | shared`).
5. Capture curl evidence for:
   - no filters
   - `due_from` only
   - `due_to` only
   - both bounds
   - invalid date format
   - invalid range (from > to)

## Acceptance criteria
- [x] `GET /v1/tasks` without query params returns the same results as before.
- [x] `GET /v1/tasks?due_from=YYYY-MM-DD` returns only tasks with `due_date >= due_from`.
- [x] `GET /v1/tasks?due_to=YYYY-MM-DD` returns only tasks with `due_date <= due_to`.
- [x] `GET /v1/tasks?due_from=...&due_to=...` returns only tasks with `due_date` within the inclusive range.
- [x] When due filters are used, tasks with `due_date = null` are not returned.
- [x] Invalid `due_from`/`due_to` format returns 400 with `{ "error": { "code": "...", "message": "..." } }`.
- [x] `due_from > due_to` returns 400 with the standard error shape.

## Evidence required
- Curl transcript showing each acceptance scenario: `docs/exec-plans/completed/sprint-06/evidence/api/s06-back-card-029-due-date-filters.txt`

## Risks
- Date-only semantics must remain timezone-independent; keep all comparisons on the Postgres `date` column, not JS Date.
- It is easy to accidentally filter only owned tasks; ensure shared tasks are included when they match.

## Verify commands
- `node --check backend/src/v1/routes/tasks/tasks.routes.js`
