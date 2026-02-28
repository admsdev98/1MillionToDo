# BACK-CARD-003: implement jwt register and login endpoints

**Type**: feature
**Priority**: high
**Status**: pending
**Sprint**: 01
**Created**: 2026-02-28

## Goal
Implement JWT authentication endpoints (register + login) using salted `crypto.scrypt` password hashing.

## Context
- Password reset is intentionally split into Sprint 02 to keep Sprint 01 small and verifiable.
- The database schema stores `password_hash` and `password_salt`.

## Scope (in)
- `POST /v1/auth/register` (create user; return JWT).
- `POST /v1/auth/login` (verify password; return JWT).
- `backend/src/lib/password-scrypt.js` (hash + verify using `crypto.scrypt`).

## Scope (out)
- `POST /v1/auth/request-password-reset` (Sprint 02).
- `POST /v1/auth/reset-password` (Sprint 02).

## Steps
1. Implement `password-scrypt.js` with:
   - random salt per password
   - `crypto.scrypt` hashing
   - constant-time comparison (`timingSafeEqual`) on verification
2. Implement `auth.routes.js` with register + login handlers.
3. On success, sign JWT with `sub = user.id` and include minimal claims (email, plan if needed).
4. Add input validation (email format, password length) using Fastify route schemas.

## Acceptance criteria
- [ ] Password is stored as salted hash (scrypt) and never stored in plain text.
- [ ] Register returns a JWT and rejects duplicate emails.
- [ ] Login returns a JWT and rejects invalid credentials.
- [ ] JWT-protected routes can use `request.user` derived from the token.

## Evidence to attach when completed
- `curl` examples for register + login showing returned JWT.
- Example of an auth-protected request succeeding with `Authorization: Bearer ...`.

## Risks
- User enumeration via register/login error messages (keep messages generic where possible).
- Weak password policy can be abused; keep a minimal length requirement.

## Test / verify commands (suggested; do not run here)
- `curl -s -X POST http://localhost:3000/v1/auth/register -H 'content-type: application/json' -d '{"email":"a@example.com","password":"strong-password"}'`
- `curl -s -X POST http://localhost:3000/v1/auth/login -H 'content-type: application/json' -d '{"email":"a@example.com","password":"strong-password"}'`
