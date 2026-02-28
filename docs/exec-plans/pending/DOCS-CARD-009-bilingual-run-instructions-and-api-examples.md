# DOCS-CARD-009: bilingual run instructions and api examples

**Type**: feature
**Priority**: low
**Status**: pending
**Sprint**: 02
**Created**: 2026-02-28

## Goal
Add concise, copy-paste run instructions and API examples in both English and Spanish.

## Context
- The repo already has `README.md` + `README.es.md` and norms in `docs/en/**` and `docs/es/**`.
- What is still missing is a practical runbook: how to start Docker, required env vars, and curl examples.

## Scope (in)
- Update `README.md` (EN) with:
  - prerequisites
  - `docker compose` run steps
  - env vars (`JWT_SECRET`, `DATABASE_URL`, `PORT`)
  - curl examples for register/login/tasks/password reset/sharing/plans
- Update `README.es.md` (ES) with the same structure and examples.

## Scope (out)
- Full OpenAPI/Swagger spec.
- Hosted deployment instructions.

## Steps
1. Add a "Run locally" section to both READMEs.
2. Add a "API quickstart" section with curl examples.
3. Add a short note about database init scripts and volume re-init behavior.

## Acceptance criteria
- [ ] Both `README.md` and `README.es.md` contain the same runnable steps.
- [ ] Examples cover the core flows and can be executed in order.
- [ ] No secrets are committed; examples use placeholders.

## Evidence to attach when completed
- Links (paths) to the updated README sections.
- A short note confirming the examples match implemented endpoints.

## Risks
- Docs can drift from the implementation if endpoint contracts change.

## Test / verify commands (suggested; do not run here)
- Follow the README steps on a clean machine/container and confirm the curl examples work.
