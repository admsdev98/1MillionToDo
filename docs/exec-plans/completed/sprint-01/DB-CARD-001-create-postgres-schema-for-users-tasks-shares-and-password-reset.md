# DB-CARD-001: create postgres schema for users, tasks, shares, and password reset

**Type**: feature
**Priority**: high
**Status**: completed
**Sprint**: 01
**Created**: 2026-02-28
**Completed**: 2026-02-28

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
- [x] Migration file name is self-explanatory.
- [x] Schema creates successfully on a clean database.
- [x] Constraints exist (unique email, share pair uniqueness, token hash uniqueness).
- [x] Indexes exist for owner and sharing lookups.

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
- `docker compose down -v && docker compose up -d db` recreated a clean volume and reran init scripts.
- `docker compose exec db psql -U postgres -d todo_app -c "\dt"` showed `users`, `tasks`, `task_shares`, and `password_reset_tokens`.
- `docker compose exec db psql -U postgres -d todo_app -c "\d users"` confirmed `users_email_key` unique constraint and plan check constraint.
- `docker compose exec db psql -U postgres -d todo_app -c "\d tasks"` confirmed `idx_tasks_owner_user_id` and FK to `users`.
- `docker compose exec db psql -U postgres -d todo_app -c "\d task_shares"` confirmed primary key `(task_id, user_id)` and sharing indexes.
- `docker compose exec db psql -U postgres -d todo_app -c "\d password_reset_tokens"` confirmed unique index on `token_hash`.
- Postgres init scripts in `/docker-entrypoint-initdb.d` run only when the data volume is fresh.

## Implementation notes

**Approach chosen**: Kept a single explicit migration and removed the extra `role` column so the schema matches Sprint 01 scope exactly.
**Alternatives considered**:
- Keep the `role` column: discarded because it adds unused scope before Sprint 02.
- Split into multiple migrations: discarded because Sprint 01 requires one clean bootstrap migration.
**Key commands run**: `docker compose down -v && docker compose up -d db` -> clean DB initialized with migration; `docker compose exec db psql -U postgres -d todo_app -c "\dt"` -> 4 expected tables created; `docker compose exec db psql -U postgres -d todo_app -c "\d users"` -> unique email and plan check verified.
