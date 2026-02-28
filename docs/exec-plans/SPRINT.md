# Sprint 01: runnable api with auth and tasks

**Status**: completed
**Started**: 2026-02-28
**Goal**: Ship a runnable Dockerized API (db + backend) with JWT register/login, request logging, and owned-task CRUD with strict per-user isolation.

## Definition of done
- `docker compose up --build` starts `db` and `api` without crashing.
- Migration runs on a clean database and creates the required tables.
- `/v1/health` returns 200.
- Register/login returns a JWT; authenticated requests work.
- Tasks CRUD works for owned tasks; cross-user access is blocked.

## What's included
- Database schema (users + tasks + sharing tables + reset tokens) applied via migration.
- Fastify skeleton: config, pg pool, JWT plugin, request logger, health route.
- Auth: register + login (JWT) using `crypto.scrypt` salted hashing.
- Tasks: owned-task CRUD (PATCH for updates) with strict multi-tenancy.

## What's NOT included
- Password reset demo endpoints (planned for Sprint 02).
- Task sharing endpoints and shared-recipient read-only rules (planned for Sprint 02).
- Subscription plan endpoints, task caps, and rate limiting (planned for Sprint 02).
- Frontend UI (planned for Sprint 02).
- Expanded bilingual runbook/API examples (planned for Sprint 02).

## Dependencies (suggested order)
1. DB-CARD-001 (schema must exist before API work can be verified).
2. BACK-CARD-002 (app skeleton + plugins + health + logging).
3. BACK-CARD-003 (JWT auth needed for protected routes).
4. BACK-CARD-004 (tasks CRUD relies on auth + db).

## Cards
- [x] DB-CARD-001: create postgres schema for users, tasks, shares, and password reset
- [x] BACK-CARD-002: bootstrap fastify app with db, jwt, and request logger
- [x] BACK-CARD-003: implement jwt register and login endpoints
- [x] BACK-CARD-004: implement owned tasks crud with strict multi-tenancy
