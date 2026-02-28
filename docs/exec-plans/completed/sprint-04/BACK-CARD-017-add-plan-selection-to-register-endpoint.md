# BACK-CARD-017: add plan selection to register endpoint

**Type**: feature
**Priority**: high
**Status**: completed
**Sprint**: 04
**Created**: 2026-02-28
**Started**: 2026-02-28
**Completed**: 2026-02-28

## Goal
Allow the frontend to select an initial subscription plan at registration time.

## Context
- Plans are locked: `free`, `premium`, `enterprise`.
- Current register endpoint only accepts `{ email, password }`.
- The frontend will simulate payment by choosing a plan during registration.

## Scope (in)
- Update `POST /v1/auth/register` to accept an optional `plan` field.
- Validate `plan` against the allowed values.
- Persist the plan to `users.plan`.
- JWT issued after registration reflects the stored plan.
- Maintain the standard error shape contract.

## Scope (out)
- Real payments/billing.
- Plan upgrade logic beyond the existing `PATCH /v1/me/plan` endpoint.

## Steps
1. Update the register request schema to include optional `plan`.
2. Persist `plan` on insert (fallback to `free` if missing).
3. Add a minimal validation error path with stable error codes.
4. Add evidence curl outputs.

## Acceptance criteria
- [x] `POST /v1/auth/register` accepts `{ email, password, plan }` and returns 201 `{ token }`.
- [x] `GET /v1/me` after register shows the selected plan.
- [x] Invalid plan returns 400 with the standard error shape.
- [x] Omitting plan preserves existing behavior (default `free`).

## Evidence to attach when completed
- Curl outputs proving register with plan works.
- `GET /v1/me` output showing plan.

## Evidence
- Register with plan: `docs/exec-plans/completed/sprint-04/evidence/api/s04-register-with-plan.txt`
- Me after register: `docs/exec-plans/completed/sprint-04/evidence/api/s04-me-after-register-plan.txt`
- Invalid plan: `docs/exec-plans/completed/sprint-04/evidence/api/s04-register-invalid-plan.txt`

## Code refs
- Register schema + insert: `backend/src/v1/routes/auth/auth.routes.js`
