# BACK-CARD-007: password reset demo flow (request token + reset)

**Type**: feature
**Priority**: medium
**Status**: pending
**Sprint**: 02
**Created**: 2026-02-28

## Goal
Add a demo password reset flow that returns a reset token in the response (no email provider), and enforces one-time use + expiry.

## Context
- The schema already includes `password_reset_tokens` with `token_hash`, `expires_at`, and `used_at`.
- This is intentionally a demo flow; the reset token is returned once so it can be tested with curl/UI.

## Scope (in)
- `POST /v1/auth/request-password-reset`
  - accepts `{ email }`
  - creates a token record for that user (if user exists)
  - returns the raw token for demo purposes
- `POST /v1/auth/reset-password`
  - accepts `{ token, newPassword }`
  - verifies token hash, expiry, and unused status
  - updates user password (new salt + hash) and marks token as used

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
4. Keep responses consistent and avoid leaking whether the email exists (decision to document in code).

## Acceptance criteria
- [ ] Request endpoint returns 200 and (for demo) returns a `resetToken` value when applicable.
- [ ] Token is stored hashed and cannot be reused after reset.
- [ ] Expired tokens are rejected.
- [ ] Reset updates `password_hash` and `password_salt`.

## Evidence to attach when completed
- `curl` example showing request -> reset works end-to-end.
- A DB query screenshot/note showing `token_hash` is stored (not raw token) and `used_at` changes.

## Risks
- User enumeration via reset request behavior (must be explicitly handled).
- Token handling bugs (accepting expired/used tokens) can become security-critical.

## Test / verify commands (suggested; do not run here)
- `curl -s -X POST http://localhost:3000/v1/auth/request-password-reset -H 'content-type: application/json' -d '{"email":"a@example.com"}'`
- `curl -s -X POST http://localhost:3000/v1/auth/reset-password -H 'content-type: application/json' -d '{"token":"<token>","newPassword":"new-strong-password"}'`
