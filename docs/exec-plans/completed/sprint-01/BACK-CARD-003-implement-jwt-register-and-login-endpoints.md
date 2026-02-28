# BACK-CARD-003: implement jwt register and login endpoints

**Type**: feature
**Priority**: high
**Status**: completed
**Sprint**: 01
**Created**: 2026-02-28
**Completed**: 2026-02-28

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
- [x] Password is stored as salted hash (scrypt) and never stored in plain text.
- [x] Register returns a JWT and rejects duplicate emails.
- [x] Login returns a JWT and rejects invalid credentials.
- [x] JWT-protected routes can use `request.user` derived from the token.

## Evidence
- `POST /v1/auth/register` returned a JWT: `{"token":"eyJ..."}`.
- `POST /v1/auth/login` returned a JWT: `{"token":"eyJ..."}`.
- Duplicate register request returned `HTTP/1.1 409` with `{"error":{"code":"CONFLICT","message":"Email already registered"}}`.
- Invalid login request returned `HTTP/1.1 401` with `{"error":{"code":"UNAUTHORIZED","message":"Invalid credentials"}}`.
- `docker compose exec db psql -U postgres -d todo_app -c "SELECT email, length(password_hash), length(password_salt) ..."` showed hashed password and salt lengths (`128` and `32`).
- A protected route using `preHandler: [app.authenticate]` returned `request.user` from JWT (`status=200` with `sub`, `userId`, `plan`, `email`).

## Evidence to attach when completed
- `curl` examples for register + login showing returned JWT.
- Example of an auth-protected request succeeding with `Authorization: Bearer ...`.

## Risks
- User enumeration via register/login error messages (keep messages generic where possible).
- Weak password policy can be abused; keep a minimal length requirement.

## Test / verify commands (suggested; do not run here)
- `curl -s -X POST http://localhost:3000/v1/auth/register -H 'content-type: application/json' -d '{"email":"a@example.com","password":"strong-password"}'`
- `curl -s -X POST http://localhost:3000/v1/auth/login -H 'content-type: application/json' -d '{"email":"a@example.com","password":"strong-password"}'`

## Implementation notes

**Approach chosen**: Added explicit register/login handlers with Fastify schemas, `crypto.scrypt` hash+verify utilities, and JWT payloads containing `sub`, `userId`, `plan`, and `email`.
**Alternatives considered**:
- Return different login errors for missing user vs wrong password: discarded to reduce user-enumeration risk.
- Store only `sub` in JWT: discarded because `userId` and `plan` claims simplify downstream route authorization checks.
**Key commands run**: `curl -s -X POST http://localhost:3001/v1/auth/register ...` -> returned JWT; `curl -s -i -X POST http://localhost:3001/v1/auth/login ...wrong-password...` -> 401 unauthorized; `node -e '...app.inject...'` -> protected route returned `request.user` from token.
