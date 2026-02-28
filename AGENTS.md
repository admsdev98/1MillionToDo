# Project Agent Rules (Local)

## Objective
Build a technical assessment: a SaaS To Do List REST API (multi-tenant per user) with a minimal visual frontend.

## Locked stack (minimal)
- Backend: Node.js + Fastify
- Database: PostgreSQL
- Auth: JWT (`@fastify/jwt`)
- DB driver: `pg`
- Password hashing: Node `crypto.scrypt` (no bcrypt/argon2 dependencies)
- Docker + docker-compose
- Frontend: vanilla HTML/CSS/JS (served by the backend)

## Required features
- Auth: register + login (JWT)
- Password reset (demo): request token + reset with token (no email provider)
- Multi-tenancy: strict per-user isolation
- Tasks: full CRUD, updates via PATCH (not PUT)
- Task sharing: join table; shared recipients are read-only
- Middleware logging: url + method + timestamp + execution time
- Subscription plans: `free`, `premium`, `enterprise`
- Limits: task caps + rate limiting based on plan
- Dockerized: app + database
- Documentation: Spanish and English

## Operating rules (safety)
- Do not run shell commands unless the user explicitly asks.
- Do not modify files unless the user explicitly asks.
- Never add secrets to the repo. Never commit real credentials.
- Avoid destructive git commands unless explicitly requested.

## Naming conventions (must be self-explanatory)
Areas: BACK, FRONT, DB, DOCS, FIX

Cards:
- `docs/exec-plans/pending/<AREA>-CARD-<NNN>-<clear-description>.md`
- Move completed cards to `docs/exec-plans/completed/sprint-xx/`

Branches:
- `sprint-xx-<area>-<clear-description>`
- Example: `sprint-01-backend-add-jwt-auth-and-password-reset`

Commits:
- Format: `type/short-clear-description`
- Use commit body lines for a short checklist of what changed.
- Example:
  - Subject: `docs/bootstrap-repo-structure-roadmap-and-sprint-01`
  - Body:
    - `- Add bilingual docs and exec plans`
    - `- Add docker compose and initial migration`

## Documentation usage (for the model)
- The model must prefer `docs/en/**` as the primary source of project documentation.
- `docs/es/**` exists mainly for humans; only use it if the user explicitly asks.

## What the model can do
- Propose sprint breakdowns and write clear cards.
- Draft minimal code and docs when asked.
- Provide curl examples and manual verification steps.
- Record short decisions: chosen approach + why + 1 alternative rejected.

## What the model must not do
- Add dependencies without a short justification.
- Invent features outside the assessment scope.
- Refactor unrelated code “for cleanliness”.
- Claim verification/testing happened unless it did.

## Context minimization
- Prefer small, file-focused changes.
- Avoid pasting full files into chat unless required.
- Track decisions and progress in `docs/exec-plans/STATUS_LOG.md`.
