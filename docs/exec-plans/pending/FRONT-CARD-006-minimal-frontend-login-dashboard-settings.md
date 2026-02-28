# FRONT-CARD-006: minimal frontend login, dashboard, and settings

**Type**: feature
**Priority**: medium
**Status**: pending
**Sprint**: 02
**Created**: 2026-02-28

## Goal
Build a minimal UI that uses real backend endpoints.

## Context
- `frontend/public/**` exists but is currently placeholder content.
- The backend serves `frontend/public/` from Docker (see `backend/Dockerfile`).

## Screens
- Login/Register
- Dashboard (tasks)
- Settings (optional)

## Scope (in)
- A single-page feel using simple view switching (no framework, no build step).
- Store JWT in `localStorage` and use it for API calls.
- Dashboard:
  - list tasks
  - create task
  - mark complete (PATCH)
  - show shared tasks as read-only with a clear badge (requires Sprint 02 sharing).
- Settings:
  - show current plan
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
5. Implement `settings-view.js` and wire logout + plan display.
6. Add basic, intentional styling in `frontend/public/app.css`.

## Acceptance criteria
- [ ] Can register/login and store JWT.
- [ ] Can list/create/complete tasks.
- [ ] Shared tasks show as read-only with a clear badge.
- [ ] UI follows tokens (ink/accent/cta) and pill radius.

## Evidence to attach when completed
- Screenshots of login + dashboard + settings.
- Short screen recording or notes showing the flow end-to-end.

## Risks
- UI can drift into mock data if endpoints are flaky; always use real API.
- Token handling bugs can lock the user out; add a clear logout/reset.

## Test / verify commands (suggested; do not run here)
- Open `http://localhost:3000/` and verify the flow manually.
