#!/usr/bin/env markdown
# FRONT-CARD-032 mobile audit notes

Date: 2026-03-01
Viewport: 360x800

## Routes checked
- `/` (landing)
- `/auth/login`
- `/auth/register` (spot-check)
- `/auth/request-password` (spot-check)
- `/app` (filters + modal + help)
- `/app/settings`
- `/error/not-found`

## Issues found and fixes
- App header navigation overflow on mobile.
  - Fix: added hamburger menu on app pages (Dashboard/Settings) and hid inline nav on small widths.
- 404 noise for `/favicon.ico` in the browser console.
  - Fix: set a data URL favicon in `frontend/public/index.html`.
- Dashboard due-date filter row needed a compact layout on mobile.
  - Fix: `task-filters-row` uses a single-column layout on small widths.

## Evidence screenshots
- Landing: `docs/exec-plans/completed/sprint-06/evidence/ui/s06-front-card-032-landing-mobile.png`
- Auth: `docs/exec-plans/completed/sprint-06/evidence/ui/s06-front-card-032-auth-mobile.png`
- Dashboard modal: `docs/exec-plans/completed/sprint-06/evidence/ui/s06-front-card-032-dashboard-modal-mobile.png`
- Settings: `docs/exec-plans/completed/sprint-06/evidence/ui/s06-front-card-032-settings-mobile.png`
- Error: `docs/exec-plans/completed/sprint-06/evidence/ui/s06-front-card-032-error-mobile.png`
