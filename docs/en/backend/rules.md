# Backend rules (EN)

## Goals
- Secure-by-default REST API with Fastify.
- Minimal dependencies.
- Clear multi-tenancy boundaries.

## Dependencies policy
Allowed runtime deps: `fastify`, `@fastify/jwt`, `pg`.
If a new dependency is proposed, write a short note: what it does and why it is required.

## API conventions
- Prefix: `/v1`
- JSON only.
- Stable error shape:
  - `{ "error": { "code": "...", "message": "..." } }`
- Auth header: `Authorization: Bearer <token>`

## Auth
- Register/login returns a JWT.
- Password reset is a demo flow:
  - `POST /v1/auth/request-password-reset` returns a reset token in the response.
  - `POST /v1/auth/reset-password` consumes the token (one-time use + expiry).

## Multi-tenancy and sharing
- Never scope by client-provided `userId`.
- Every task access checks: owner or shared.
- Shared recipients are read-only (no edit/delete/share).

## Logging middleware
For every request, log:
- url
- method
- timestamp
- execution time (ms)

## Subscription plans and limits
Plans: `free`, `premium`, `enterprise`.
- Task caps apply to owned tasks only.
- Rate limiting is per-user (auth) and per-IP (unauth).
