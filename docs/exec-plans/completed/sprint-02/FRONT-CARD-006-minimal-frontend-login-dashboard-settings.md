# FRONT-CARD-006: minimal frontend login, dashboard, and settings

**Type**: feature
**Priority**: medium
**Status**: completed
**Sprint**: 02
**Created**: 2026-02-28
**Completed**: 2026-02-28

## Goal
Build a minimal UI that uses real backend endpoints.

## Context
- `frontend/public/**` exists but is currently placeholder content.
- The backend serves `frontend/public/` from Docker (see `backend/Dockerfile`).
- Sprint 02 API contract uses snake_case payloads and `access: "owner" | "shared"` for task ownership visibility.

## Screens
- Login/Register
- Dashboard (tasks)
- Settings (optional)

## Scope (in)
- A single-page feel using simple view switching (no framework, no build step).
- Store JWT in `localStorage` and use it for API calls.
- Consume API contracts exactly as defined (snake_case payloads and error shape).
- Dashboard:
  - list tasks
  - create task
  - mark complete (PATCH)
  - show shared tasks as read-only with a clear badge when `access` is `shared`.
- Settings:
  - show current plan from `GET /v1/me`
  - demo plan change (calls backend)
  - logout

## Scope (out)
- No SSR, no routing library, no component framework.
- No advanced filtering/search.

## Steps
1. Implement `frontend/public/shared/api-client.js` as the single place for HTTP calls.
2. Implement `frontend/public/shared/auth-store.js` (localStorage token + helpers).
3. Implement `login-view.js` (register/login toggle + form validation).
4. Implement `dashboard-view.js` + `tasks-api.js` + `task-card.js`.
5. Implement shared-task rendering using `access` marker and disable write actions for shared tasks.
6. Implement `settings-view.js` and wire logout + plan display via `GET /v1/me`.
7. Add basic, intentional styling in `frontend/public/app.css`.

## Acceptance criteria
- [x] Can register/login and store JWT.
- [x] Can list/create/complete tasks.
- [x] Shared tasks show as read-only with a clear badge based on `access: "shared"`.
- [x] Settings loads plan using `/v1/me` and does not infer plan from JWT payload.
- [x] Frontend request payloads use snake_case keys where applicable.
- [x] UI follows tokens (ink/accent/cta) and pill radius.

## Evidence to attach when completed
- Screenshots of login + dashboard + settings.
- Short screen recording or notes showing the flow end-to-end.

## Evidence
- Screenshots:
  - login: `docs/exec-plans/completed/sprint-02/evidence/s02-login.png`
  - dashboard: `docs/exec-plans/completed/sprint-02/evidence/s02-dashboard.png`
  - settings: `docs/exec-plans/completed/sprint-02/evidence/s02-settings.png`
- Key files:
  - Entry + view routing: `frontend/public/app.js`
  - API wrapper: `frontend/public/shared/api-client.js`
  - Auth storage: `frontend/public/shared/auth-store.js`
  - Views: `frontend/public/views/login-view.js`, `frontend/public/views/dashboard-view.js`, `frontend/public/views/settings-view.js`
  - Styling: `frontend/public/app.css`

## Risks
- UI can drift into mock data if endpoints are flaky; always use real API.
- Token handling bugs can lock the user out; add a clear logout/reset.

## Test / verify commands (suggested; do not run here)
- Open `http://localhost:3000/` and verify the flow manually.
