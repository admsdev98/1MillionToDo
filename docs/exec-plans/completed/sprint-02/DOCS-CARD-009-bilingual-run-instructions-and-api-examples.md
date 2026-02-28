# DOCS-CARD-009: bilingual run instructions and api examples

**Type**: feature
**Priority**: low
**Status**: completed
**Sprint**: 02
**Created**: 2026-02-28
**Completed**: 2026-02-28

## Goal
Add concise, copy-paste run instructions and API examples in both English and Spanish.

## Context
- The repo already has `README.md` + `README.es.md` and norms in `docs/en/**` and `docs/es/**`.
- What is still missing is a practical runbook: how to start Docker, required env vars, and curl examples.

## Scope (in)
- Update `README.md` (EN) with:
  - prerequisites
  - `pgcrypto` prerequisite note for UUID generation in migrations
  - `docker compose` run steps
  - env vars (`JWT_SECRET`, `DATABASE_URL`, `PORT`)
  - curl examples for register/login/tasks/password reset/sharing/plans using snake_case JSON fields
- Update `README.es.md` (ES) with the same structure and examples.

## Scope (out)
- Full OpenAPI/Swagger spec.
- Hosted deployment instructions.

## Steps
1. Add a "Run locally" section to both READMEs.
2. Add a "API quickstart" section with curl examples.
3. Add a short note about database init scripts and Docker volume re-init behavior.
4. Add a troubleshooting note for migration changes requiring `docker compose down -v` before re-run.

## Acceptance criteria
- [x] Both `README.md` and `README.es.md` contain the same runnable steps.
- [x] Examples cover the core flows and use snake_case contracts (for example `reset_token`, `new_password`).
- [x] Docs include `pgcrypto` prerequisite and volume reset note.
- [x] No secrets are committed; examples use placeholders.

## Evidence to attach when completed
- Links (paths) to the updated README sections.
- A short note confirming the examples match implemented endpoints.

## Evidence
- English runbook + curl examples: `README.md`
- Spanish runbook + curl examples: `README.es.md`

## Risks
- Docs can drift from the implementation if endpoint contracts change.

## Test / verify commands (suggested; do not run here)
- Follow the README steps on a clean machine/container and confirm the curl examples work.
