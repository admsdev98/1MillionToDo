#!/usr/bin/env markdown
# FRONT-CARD-028 manual verification

Date: 2026-03-01

## Checks
- Unauthenticated:
  - Opened `/` in a fresh browser context -> landing view renders.
- Authenticated:
  - With a JWT in `localStorage`, opening `/` redirects to `/app` (history replace, no landing render).
- App header navigation:
  - `/app` and `/app/settings` no longer show a Home/Inicio link.
  - Brand link in app pages navigates to `/app`.
- Language:
  - ES is default.
  - EN toggle works and does not change routing behavior.

## Evidence
- Mobile dashboard header screenshot: `docs/exec-plans/completed/sprint-06/evidence/ui/s06-front-card-028-dashboard-header-mobile.png`
