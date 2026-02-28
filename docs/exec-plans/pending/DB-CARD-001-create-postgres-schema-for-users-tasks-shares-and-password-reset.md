# DB-CARD-001: create postgres schema for users, tasks, shares, and password reset

**Type**: feature
**Priority**: high
**Status**: pending
**Sprint**: 01
**Created**: 2026-02-28

## Goal
Have a clean, reproducible Postgres schema (via a migration) that supports auth, owned tasks, sharing, and password reset tokens.

## Context
- `db/migrations/001-create-users-tasks-task-shares-and-password-reset-tables.sql` already exists, but this card treats it as the source of truth that must work on a clean database.
- Docker initializes SQL in `/docker-entrypoint-initdb.d` only on a fresh volume.

## Scope (in)
- `users` table: `email` unique, `password_hash`, `password_salt`, `plan`, timestamps.
- `tasks` table: `owner_user_id` FK, indexes for owner lookups.
- `task_shares` join table: `(task_id, user_id)` primary key + indexes.
- `password_reset_tokens` table: `token_hash` unique + expiry + one-time use fields.

## Scope (out)
- No seed data.
- No additional migrations beyond the initial schema.

## Steps
1. Review the migration file for constraints, indexes, and FK behavior.
2. Confirm `docker-compose.yml` mounts `db/migrations/` to `/docker-entrypoint-initdb.d:ro`.
3. Document the re-init behavior (needs a fresh volume) in the Evidence notes.

## Acceptance criteria
- [ ] Migration file name is self-explanatory.
- [ ] Schema creates successfully on a clean database.
- [ ] Constraints exist (unique email, share pair uniqueness, token hash uniqueness).
- [ ] Indexes exist for owner and sharing lookups.

## Evidence to attach when completed
- Output of `\dt` (or equivalent) showing the tables exist.
- Output of `\d users` / `\d tasks` showing key constraints and indexes.
- A short note that init scripts run only on a fresh volume.

## Risks
- Init SQL will not rerun if the `postgres_data` volume already exists (false positives when testing).
- Extension usage (`pgcrypto`) can fail in restricted environments.

## Test / verify commands (suggested; do not run here)
- `docker compose up -d db`
- `docker compose exec db psql -U postgres -d todo_app -c "\dt"`
- `docker compose down -v` (only when you intentionally want a clean re-init)

## Evidence
- `docker compose up` initializes tables via migrations.
