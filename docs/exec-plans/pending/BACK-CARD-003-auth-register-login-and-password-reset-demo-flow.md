# BACK-CARD-003: auth register/login and password reset demo flow

**Type**: feature
**Priority**: high
**Status**: pending
**Sprint**: 01

## Goal
Implement authentication endpoints and a password reset flow without email infrastructure.

## Scope
- `POST /v1/auth/register`
- `POST /v1/auth/login`
- `POST /v1/auth/request-password-reset` (returns token for demo)
- `POST /v1/auth/reset-password`

## Acceptance criteria
- [ ] Password is stored as salted hash (scrypt).
- [ ] Login returns JWT.
- [ ] Reset request stores token_hash + expiry and returns raw token once.
- [ ] Reset consumes token and cannot be reused.
