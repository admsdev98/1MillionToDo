# DB-CARD-018: add due date and tag to tasks table

**Type**: database
**Priority**: high
**Status**: completed
**Sprint**: 04
**Created**: 2026-02-28
**Started**: 2026-02-28
**Completed**: 2026-02-28

## Goal
Extend the database schema to support a due date (date-only) and a tag on tasks.

## Context
- Current `tasks` schema does not support due dates or tags.
- Sprint 04 UI requires selecting a due date and a tag.

## Scope (in)
- Add nullable columns to `tasks`:
  - `due_date` as `date NULL` (date-only, no time)
  - `tag` as `text NULL`
- Keep backward compatibility: existing tasks remain valid.

## Scope (out)
- Tag tables, tag analytics, indexes beyond what is required for correctness.

## Steps
1. Create a new migration to add the two columns.
2. Ensure the app still boots with a clean DB.
3. Capture `\d tasks` output as evidence.

## Acceptance criteria
- [x] A new migration exists and applies cleanly.
- [x] `tasks` has `due_date` (`date`) and `tag` (`text`) columns.
- [x] Existing endpoints still function when these fields are NULL.

## Evidence to attach when completed
- `psql` output showing the updated tasks table.

## Evidence
- Migration: `db/migrations/002-add-due-date-and-tag-to-tasks-table.sql`
- Tasks table schema: `docs/exec-plans/completed/sprint-04/evidence/db/s04-tasks-table-schema.txt`
