# FRONT-CARD-028: redirect authenticated root to app and remove home link

**Type**: feature
**Priority**: high
**Status**: pending
**Sprint**: 06
**Created**: 2026-03-01

## Goal
When a user is authenticated, visiting `/` routes them to `/app` (product home), and app headers no longer show a confusing Home/Inicio link.

## Context (file paths)
- Frontend routing + auth gating: `frontend/public/app.js`
- Landing header links: `frontend/public/views/landing-view.js`
- Dashboard header/nav: `frontend/public/views/dashboard-view.js`
- Settings header/nav: `frontend/public/views/settings-view.js`
- Error view back links (may point to `/`): `frontend/public/views/error-view.js`
- Translations (ES default, EN alternate): `frontend/public/shared/i18n.js`
- Shared styles: `frontend/public/app.css`

## Scope (in)
- Add a client-side redirect: if authenticated and route is `/`, immediately navigate to `/app` (use replace semantics to avoid back-button weirdness).
- Remove the Home/Inicio link from the app navigation (dashboard + settings).
- Change the app brand link target from `/` to `/app` (dashboard + settings).
- Keep language behavior consistent (ES default; EN toggle still works after redirect).

## Scope (out)
- Changing landing content/structure beyond what is needed to keep links correct.
- Any backend changes.

## Steps
1. Update `frontend/public/app.js` route render flow so `route.id === "landing"` + `isAuthenticated` redirects to `/app` with `replace: true`.
2. Update `frontend/public/views/dashboard-view.js` header:
   - Remove the Home/Inicio link.
   - Point the brand link to `/app`.
3. Update `frontend/public/views/settings-view.js` header:
   - Remove the Home/Inicio link.
   - Point the brand link to `/app`.
4. Sanity-check that unauthenticated users still see the landing page at `/`.
5. Manually verify both languages (ES default, EN alternate) for labels and navigation behavior.

## Acceptance criteria
- [ ] With a valid JWT in `localStorage`, visiting `/` lands on `/app` without rendering the landing view.
- [ ] Without a JWT, visiting `/` renders the landing view.
- [ ] App pages (`/app`, `/app/settings`) have no Home/Inicio link in the header navigation.
- [ ] The brand link in app pages navigates to `/app`.
- [ ] ES default and EN alternate produce consistent navigation labels and routes.

## Evidence required
- Manual verification notes: `docs/exec-plans/completed/sprint-06/evidence/ui/s06-front-card-028-manual-check.md`
- Screenshot (mobile width) of dashboard header showing brand + hamburger/links as applicable: `docs/exec-plans/completed/sprint-06/evidence/ui/s06-front-card-028-dashboard-header-mobile.png`

## Risks
- Token presence is used as the auth signal; stale/invalid tokens will still redirect to `/app` (expected for this MVP, but verify it does not create navigation loops).
- Removing Home/Inicio might leave unused i18n keys; avoid unnecessary translation churn.

## Verify commands
- `node --check frontend/public/app.js`
- `node --check frontend/public/views/dashboard-view.js`
- `node --check frontend/public/views/settings-view.js`
