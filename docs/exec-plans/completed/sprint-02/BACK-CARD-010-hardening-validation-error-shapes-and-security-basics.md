# BACK-CARD-010: hardening (validation, error shape, security basics)

**Type**: refactor
**Priority**: high
**Status**: completed
**Sprint**: 02
**Created**: 2026-02-28
**Started**: 2026-02-28
**Completed**: 2026-02-28

## Goal
Set the Sprint 02 quality gate first so every following card uses the same validation, error contracts, and baseline security behavior.

## Context
- This card should run first in Sprint 02 because it defines cross-card API contracts.
- Fastify supports JSON schema validation out of the box; use it consistently.
- A stable error shape makes frontend and docs work predictable.

## Scope (in)
- Add/standardize route schemas for request bodies, params, and responses.
- Standardize error responses to one JSON shape: `{ "error": { "code": "...", "message": "..." } }`.
- Define and document a stable error-code list for Sprint 02.
- Include explicit limit errors in that list: `RATE_LIMITED` and `PLAN_LIMIT_REACHED`.
- Ensure JWT secret is required in production.
- Add basic security headers (manually, no new deps) if not already present.

## Scope (out)
- Full security audit.
- Advanced RBAC beyond the required rules.

## Steps
1. Define a sprint error-code table with expected HTTP status for each code.
2. Add schemas to all Sprint 02 auth/tasks/share/plan routes.
3. Add a single error handler that maps validation/auth/permission/not-found/limit failures to stable codes.
4. Ensure sensitive errors are not leaked in production mode.
5. Add minimal security headers (e.g., `X-Content-Type-Options`, `Referrer-Policy`).

## Error-code baseline for Sprint 02
- `VALIDATION_ERROR` -> 400
- `UNAUTHORIZED` -> 401
- `FORBIDDEN` -> 403
- `NOT_FOUND` -> 404
- `PLAN_LIMIT_REACHED` -> 403
- `RATE_LIMITED` -> 429

## Acceptance criteria
- [x] Invalid payloads consistently return 400 with `VALIDATION_ERROR` and the standard error shape.
- [x] Unauthorized requests return 401 (`UNAUTHORIZED`); forbidden requests return 403 (`FORBIDDEN`).
- [x] Plan cap failures return 403 (`PLAN_LIMIT_REACHED`) and rate limiting returns 429 (`RATE_LIMITED`).
- [x] Sprint 02 routes include schemas for body/params/response.
- [x] No stack traces are returned in production responses.
- [x] Security headers are present on responses.

## Evidence
- Security headers present on `/v1/health`: `docs/exec-plans/completed/sprint-02/evidence/api/s02-health.txt`
- Standard error shape shown for shared write attempt (403 + stable code): `docs/exec-plans/completed/sprint-02/evidence/api/s02-recipient-patch.txt`
- Docker fix for production secret: `docker-compose.yml` uses a non-default demo `JWT_SECRET`
- Code refs:
  - Global error shape + stable codes: `backend/src/app.js`
  - Security headers hook: `backend/src/plugins/security-headers.js`
  - Production JWT secret enforcement: `backend/src/config.js`

## Evidence to attach when completed
- Example error responses for 400/401/403/404/429 including plan-limit and rate-limit cases.
- A response header snapshot showing the security headers.

## Risks
- Over-hardening can slow delivery; keep changes small and focused.

## Test / verify commands (suggested; do not run here)
- `curl -i http://localhost:3000/v1/does-not-exist`
- `curl -i -X POST http://localhost:3000/v1/auth/register -H 'content-type: application/json' -d '{}'`
