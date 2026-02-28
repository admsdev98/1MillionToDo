# BACK-CARD-019: support due date and tag in task endpoints

**Type**: feature
**Priority**: high
**Status**: completed
**Sprint**: 04
**Created**: 2026-02-28
**Started**: 2026-02-28
**Completed**: 2026-02-28

## Goal
Expose `due_date` (date-only) and `tag` in the tasks API and validate the new fields.

## Context
- Sprint 04 DB card adds `tasks.due_date` and `tasks.tag`.
- The frontend needs to set and edit these fields.

## Scope (in)
- Update task response schemas to include `due_date` and `tag`.
- Update `POST /v1/tasks` to accept optional `due_date` and `tag`.
- Update `PATCH /v1/tasks/:id` to allow patching `due_date` and `tag`.
- Keep shared tasks read-only for recipients.

## Scope (out)
- Filtering tasks by due date or tag.
- Sorting by due date.

## Steps
1. Extend DB queries to SELECT `due_date` and `tag`.
2. Extend create and patch logic to write those columns.
3. Add schema validation for due_date format `YYYY-MM-DD` (date-only).
4. Add curl evidence for create + patch.

## Acceptance criteria
- [x] Create task with `due_date` and `tag` returns those fields.
- [x] Patch task updates `due_date` and `tag` for owned tasks.
- [x] Shared recipients still cannot patch/delete tasks (403 + stable code).
- [x] Invalid `due_date` returns 400 with the standard error shape.

## Evidence to attach when completed
- Curl outputs for create/patch showing persisted values.

## Evidence
- Create with due date/tag: `docs/exec-plans/completed/sprint-04/evidence/api/s04-task-create-due-tag.txt`
- Patch due date/tag: `docs/exec-plans/completed/sprint-04/evidence/api/s04-task-patch-due-tag.txt`
- Invalid due date: `docs/exec-plans/completed/sprint-04/evidence/api/s04-task-invalid-due-date.txt`

## Code refs
- Task schemas + SQL: `backend/src/v1/routes/tasks/tasks.routes.js`
