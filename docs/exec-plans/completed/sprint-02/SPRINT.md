# Sprint 02: reset, sharing, limits, frontend, docs, and hardening

**Status**: completed
**Started**: 2026-02-28
**Completed**: 2026-02-28
**Goal**: Complete Sprint 02 with one stable API contract across backend, frontend, and docs before endpoint-heavy implementation begins.

## Canonical source
- This file is the canonical Sprint 02 plan.
- Execution scope is defined by this file plus cards in `docs/exec-plans/pending/`, `docs/exec-plans/active/`, and `docs/exec-plans/completed/`.
- Sprint 01 history is archived in `docs/exec-plans/completed/sprint-01/SPRINT.md`.

## Cards (Sprint 02)
- [x] BACK-CARD-010: hardening validation, error shapes, and security basics
- [x] BACK-CARD-005: subscription plans, task caps, and rate limiting
- [x] BACK-CARD-007: password reset demo flow request token and reset
- [x] BACK-CARD-008: task sharing endpoints and read-only recipients
- [x] FRONT-CARD-006: minimal frontend login, dashboard, and settings
- [x] DOCS-CARD-009: bilingual run instructions and api examples

## Recommended execution order
1. BACK-CARD-010 (quality gate and contract first)
2. BACK-CARD-005 (plan and limit contracts used by later cards)
3. BACK-CARD-007 (reset flow with contract-aligned payloads)
4. BACK-CARD-008 (sharing rules and read-only contract)
5. FRONT-CARD-006 (consume final contracts)
6. DOCS-CARD-009 (document final verified behavior)

## Cross-card decisions / quality gates
- JSON request/response payloads use `snake_case`.
- Shared-task marker is `access` with values `owner` or `shared`.
- Plan enforcement is always resolved from database state, not from JWT `plan` claims.
- All routes touched in Sprint 02 must define Fastify schemas for params/body/response.
- Error responses must follow one shape: `{ "error": { "code": "...", "message": "..." } }`.
- Error codes must be stable and include at least: `VALIDATION_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `RATE_LIMITED`, and `PLAN_LIMIT_REACHED`.
- Postgres setup must document `pgcrypto` prerequisite and volume reset behavior after migration changes.

## Definition of done
- All six Sprint 02 cards are completed and moved to `docs/exec-plans/completed/` with evidence.
- Sprint 02 endpoints and frontend flows use only `snake_case` JSON fields.
- Shared tasks are read-only for recipients and expose `access: "shared"` consistently.
- Plan limits and rate limiting use database-backed plan decisions and return contract-stable errors.
- Invalid requests, auth failures, forbidden actions, not found routes, and rate-limit events return the standard error shape and expected HTTP status codes.
- README docs in English and Spanish match the implemented contracts, including `pgcrypto` and Docker volume notes.
