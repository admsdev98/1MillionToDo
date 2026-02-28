# DB-CARD-001: create postgres schema for users, tasks, shares, and password reset

**Type**: feature
**Priority**: high
**Status**: pending
**Sprint**: 01

## Goal
Create the Postgres schema required by the assessment.

## Scope
- Users table with plan and role
- Tasks table scoped by owner
- Task shares join table
- Password reset tokens table

## Acceptance criteria
- [ ] Migration file name is self-explanatory.
- [ ] Schema creates successfully on a clean database.
- [ ] Constraints exist (unique email, share pair uniqueness, token hash uniqueness).
- [ ] Indexes exist for owner and sharing lookups.

## Evidence
- `docker compose up` initializes tables via migrations.
