# Roadmap

This file is informational only.

Canonical execution source:
- `docs/exec-plans/SPRINT.md`
- Card files under `docs/exec-plans/pending/`, `docs/exec-plans/active/`, and `docs/exec-plans/completed/`

## Completed in Sprint 01

### DB
- [x] Create base schema: users, tasks, task_shares, password_reset_tokens
- [x] Add indexes for ownership and sharing lookups

### BACK
- [x] Bootstrap Fastify app with pg connection, JWT, and request logging
- [x] Implement auth: register/login
- [x] Implement tasks CRUD (PATCH updates)
- [x] Serve frontend static assets from the backend

## Planned in Sprint 02 (see canonical sprint file)

### BACK
- [x] BACK-CARD-010: hardening validation, error shapes, and security basics
- [x] BACK-CARD-005: subscription plans, task caps, and rate limiting
- [x] BACK-CARD-007: password reset demo flow
- [x] BACK-CARD-008: task sharing with read-only recipients

### FRONT
- [x] FRONT-CARD-006: minimal frontend login, dashboard, and settings

### DOCS
- [x] DOCS-CARD-009: bilingual run instructions and API examples
