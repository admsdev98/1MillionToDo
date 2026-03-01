# FRONT-CARD-032: mobile responsive audit and fixes

**Type**: refactor
**Priority**: medium
**Status**: pending
**Sprint**: 06
**Created**: 2026-03-01

## Goal
Audit and fix mobile responsiveness issues across the full UI surface (landing, auth, reset, dashboard, modal, settings, errors).

## Context (file paths)
- Global styles: `frontend/public/app.css`
- App router + route gating: `frontend/public/app.js`
- Landing: `frontend/public/views/landing-view.js`
- Auth + reset: `frontend/public/views/auth-view.js`
- Dashboard + modal + help panel: `frontend/public/views/dashboard-view.js`
- Settings: `frontend/public/views/settings-view.js`
- Error pages: `frontend/public/views/error-view.js`
- Shared DOM helpers: `frontend/public/views/ui.js`

## Scope (in)
- Mobile audit on a narrow viewport (e.g. 360x800) for:
  - Layout overflow / horizontal scrolling
  - Header/menu behavior on app pages
  - Form field sizing and tap targets (auth/register/reset/create task/settings)
  - Task modal sizing, scroll behavior, and close affordances
  - Help panel sizing and safe-area spacing
  - Error page action buttons layout
- Implement small, focused CSS/markup fixes only where needed.

## Scope (out)
- Visual redesign or new component library.
- New dependencies or build tooling.

## Steps
1. Run through each route on mobile width:
   - `/` (landing)
   - `/auth/login`, `/auth/register`
   - `/auth/request-password`
   - `/app` (open modal + help panel)
   - `/app/settings`
   - `/error/not-found`, `/error/forbidden`, `/error/unexpected`
2. For each page, record concrete issues (overflow, clipped buttons, unreadable text) and fix them in `frontend/public/app.css` or the relevant view file.
3. Re-check after fixes to ensure no new regressions on desktop widths.

## Acceptance criteria
- [ ] No page introduces horizontal scrolling on a 360px-wide viewport.
- [ ] All primary actions remain reachable on mobile: login/register, request/reset password, create task, open/close modal, update plan, logout.
- [ ] Task modal content is usable on mobile (no clipped bottom actions; content scrolls when needed).
- [ ] Error pages show both action buttons without overlap or truncation.
- [ ] Desktop layout remains intact (no obviously broken spacing).

## Evidence required
- Manual audit notes listing issues found + fixes made: `docs/exec-plans/completed/sprint-06/evidence/ui/s06-front-card-032-mobile-audit-notes.md`
- Screenshots (at least):
  - `docs/exec-plans/completed/sprint-06/evidence/ui/s06-front-card-032-landing-mobile.png`
  - `docs/exec-plans/completed/sprint-06/evidence/ui/s06-front-card-032-auth-mobile.png`
  - `docs/exec-plans/completed/sprint-06/evidence/ui/s06-front-card-032-dashboard-modal-mobile.png`
  - `docs/exec-plans/completed/sprint-06/evidence/ui/s06-front-card-032-settings-mobile.png`
  - `docs/exec-plans/completed/sprint-06/evidence/ui/s06-front-card-032-error-mobile.png`

## Risks
- Fixes can be piecemeal and drift into redesign; keep changes minimal and tied to a specific mobile break.
- CSS changes can create desktop regressions; always re-check desktop after each fix.

## Verify commands
- `node --check frontend/public/app.js`
- `node --check frontend/public/views/*.js`
