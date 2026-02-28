# BACK-CARD-010: hardening (validation, error shape, security basics)

**Type**: refactor
**Priority**: low
**Status**: pending
**Sprint**: 02
**Created**: 2026-02-28

## Goal
Reduce assessment risk by making the API predictable and safer: input validation, stable error responses, and a few security basics without adding new runtime dependencies.

## Context
- Fastify supports JSON schema validation out of the box; use it consistently.
- A stable error shape makes the frontend simpler and reduces debugging time.

## Scope (in)
- Add/standardize route schemas for request bodies and params.
- Standardize error responses to a single JSON shape (per `docs/en/backend/rules.md`).
- Ensure JWT secret is required in production.
- Add basic security headers (manually, no new deps) if not already present.

## Scope (out)
- Full security audit.
- Advanced RBAC beyond the required rules.

## Steps
1. Add schemas to all auth/tasks/share/plan routes.
2. Add a single error handler that maps common failures to clear error codes.
3. Ensure sensitive errors are not leaked in production mode.
4. Add minimal security headers (e.g., `X-Content-Type-Options`, `Referrer-Policy`).

## Acceptance criteria
- [ ] Invalid payloads consistently return 400 with `{ "error": { "code": "...", "message": "..." } }`.
- [ ] Unauthorized requests return 401; forbidden requests return 403.
- [ ] No stack traces are returned in production responses.
- [ ] Security headers are present on responses.

## Evidence to attach when completed
- Example error responses for 400/401/403/404.
- A response header snapshot showing the security headers.

## Risks
- Over-hardening can slow delivery; keep changes small and focused.

## Test / verify commands (suggested; do not run here)
- `curl -i http://localhost:3000/v1/does-not-exist`
- `curl -i -X POST http://localhost:3000/v1/auth/register -H 'content-type: application/json' -d '{}'`
