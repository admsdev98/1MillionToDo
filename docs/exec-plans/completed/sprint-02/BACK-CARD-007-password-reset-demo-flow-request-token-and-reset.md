# BACK-CARD-007: password reset demo flow (request token + reset)

**Type**: feature
**Priority**: medium
**Status**: completed
**Sprint**: 02
**Created**: 2026-02-28
**Completed**: 2026-02-28

## Goal
Add a demo password reset flow that returns a reset token in the response (no email provider), enforces one-time use + expiry, and keeps anti-enumeration behavior.

## Context
- The schema already includes `password_reset_tokens` with `token_hash`, `expires_at`, and `used_at`.
- This is intentionally a demo flow; the reset token is returned once so it can be tested with curl/UI.

## Scope (in)
- `POST /v1/auth/request-password-reset`
  - accepts `{ email }`
  - creates a token record for that user (if user exists)
  - returns a `reset_token` field for demo purposes using a uniform response shape
- `POST /v1/auth/reset-password`
  - accepts `{ reset_token, new_password }`
  - verifies token hash, expiry, and unused status
  - updates user password (new salt + hash) and marks token as used

## Contract notes (locked)
- JSON keys are `snake_case` (`reset_token`, `new_password`).
- Anti-enumeration baseline: reset-request endpoint always returns 200 and a uniform response shape regardless of email existence.
- Error response shape: `{ "error": { "code": "...", "message": "..." } }`.
- Error codes for reset flow:
  - `VALIDATION_ERROR` -> 400
  - `RESET_TOKEN_INVALID` -> 400
  - `RESET_TOKEN_EXPIRED` -> 410
  - `RESET_TOKEN_ALREADY_USED` -> 409

## Scope (out)
- No email sending.
- No password reset UI copy beyond what Sprint 02 UI needs.

## Steps
1. Generate a cryptographically random token (raw) and store only a hash in DB (e.g., SHA-256).
2. Store `expires_at` (short TTL, e.g., 15 minutes) and keep `used_at` null until consumed.
3. On reset, use a transaction to:
   - select token row FOR UPDATE
   - validate not expired and not used
   - update user password hash/salt
   - set `used_at = now()`
4. Keep reset-request responses uniform (status + shape) to avoid leaking whether the email exists.
5. Ensure request/reset payload examples and schemas use only snake_case keys.

## Acceptance criteria
- [x] Request endpoint returns 200 with a uniform shape for both existing and non-existing emails.
- [x] Request/reset endpoints use `reset_token` and `new_password` (snake_case).
- [x] Token is stored hashed and cannot be reused after reset.
- [x] Expired tokens are rejected.
- [x] Invalid/expired/used token paths return stable error codes and status codes.
- [x] Reset updates `password_hash` and `password_salt`.

## Evidence to attach when completed
- `curl` example showing request -> reset works end-to-end.
- A DB query screenshot/note showing `token_hash` is stored (not raw token) and `used_at` changes.

## Evidence
- Request + reset success: `docs/exec-plans/completed/sprint-02/evidence/api/s02-reset.txt`
- DB proof that only `token_hash` is stored and `used_at` changes:
  - before consume: `docs/exec-plans/completed/sprint-02/evidence/api/s02-reset-db-before.txt`
  - after consume: `docs/exec-plans/completed/sprint-02/evidence/api/s02-reset-db-after.txt`
- Code refs:
  - Reset routes: `backend/src/v1/routes/auth/password-reset.routes.js`
  - Password hashing: `backend/src/lib/password-scrypt.js`
  - DB schema: `db/migrations/001-create-users-tasks-task-shares-and-password-reset-tables.sql`

## Risks
- User enumeration via reset request behavior (must be explicitly handled).
- Token handling bugs (accepting expired/used tokens) can become security-critical.

## Test / verify commands (suggested; do not run here)
- `curl -s -X POST http://localhost:3000/v1/auth/request-password-reset -H 'content-type: application/json' -d '{"email":"a@example.com"}'`
- `curl -s -X POST http://localhost:3000/v1/auth/reset-password -H 'content-type: application/json' -d '{"reset_token":"<token>","new_password":"new-strong-password"}'`
