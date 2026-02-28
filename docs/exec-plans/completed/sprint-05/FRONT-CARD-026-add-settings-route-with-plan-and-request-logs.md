# FRONT-CARD-026: add settings route with plan and request logs

**Type**: feature
**Priority**: high
**Status**: completed
**Sprint**: 05
**Created**: 2026-02-28
**Started**: 2026-02-28
**Completed**: 2026-02-28

## Goal
Add a real settings route to complete account controls for the demo.

## Context
- `/app/settings` route is missing from the frontend router.
- API support for plan updates and request logs already exists.

## Scope (in)
- Add `/app/settings` route in SPA router and gate it behind auth.
- Build a minimal settings view with:
  - signed-in email and current plan
  - plan selector using `PATCH /v1/me/plan`
  - request log viewer using `GET /v1/me/request-logs`
- Keep UI consistent with dashboard styles.

## Scope (out)
- Billing/payment integration.
- Account deletion endpoint (optional future card).

## Steps
1. Add settings route to router.
2. Implement settings screen structure and data loading.
3. Wire plan update and logs refresh.

## Acceptance criteria
- [x] `/app/settings` renders when authenticated and redirects to login when not authenticated.
- [x] Settings shows signed-in email and active plan.
- [x] Plan update works via `PATCH /v1/me/plan`.
- [x] Request logs list loads via `GET /v1/me/request-logs`.

## Evidence to attach when completed
- Manual verification notes and key files changed.

## Evidence
- `docs/exec-plans/completed/sprint-05/evidence/ui/s05-card-026-settings-route-manual-check.md`

## Code refs
- `frontend/public/app.js`
- `frontend/public/views/settings-view.js`
- `frontend/public/views/dashboard-view.js`
- `frontend/public/app.css`

## Implementation notes

**Approach chosen**: Added `/app/settings` as an auth-gated SPA route and built a simple settings page that directly uses existing `/v1/me`, `/v1/me/plan`, and `/v1/me/request-logs` endpoints.
**Alternatives considered**:
- Reuse a modal inside dashboard instead of route: discarded because a dedicated route is clearer and matches requirement.
- Build extra API wrappers before integrating: discarded because direct API calls keep scope small for this card.
**Key commands run**: `node --check frontend/public/app.js && node --check frontend/public/views/settings-view.js && node --check frontend/public/views/dashboard-view.js` -> syntax checks passed; Playwright check confirmed auth-gating, plan update, and request logs rendering at `/app/settings`.
