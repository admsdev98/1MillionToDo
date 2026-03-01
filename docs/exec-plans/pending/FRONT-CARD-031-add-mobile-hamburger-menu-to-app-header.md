# FRONT-CARD-031: add mobile hamburger menu to app header

**Type**: feature
**Priority**: high
**Status**: pending
**Sprint**: 06
**Created**: 2026-03-01

## Goal
On mobile, app pages use a hamburger menu instead of an always-visible header nav that can overflow.

## Context (file paths)
- Dashboard header/nav markup: `frontend/public/views/dashboard-view.js`
- Settings header/nav markup: `frontend/public/views/settings-view.js`
- Shared styles + breakpoints: `frontend/public/app.css`
- Translations (menu button label if needed): `frontend/public/shared/i18n.js`

## Scope (in)
- Replace the current app header navigation with a responsive pattern:
  - Desktop/tablet: keep inline navigation visible.
  - Mobile: show a hamburger button that toggles a menu panel containing the same actions (Dashboard, Settings, Language toggle, Logout).
- Ensure accessibility basics:
  - Menu button has an accessible label.
  - `aria-expanded` reflects open/closed.
  - Menu can be closed by selecting a link.

## Scope (out)
- Redesigning landing/auth headers.
- Adding a global component system (keep changes local to the two app views).

## Steps
1. Update `frontend/public/views/dashboard-view.js` to render:
   - Brand link to `/app`
   - A menu toggle button (hamburger)
   - A nav container that can be shown/hidden on mobile
2. Update `frontend/public/views/settings-view.js` with the same header structure.
3. Add CSS rules in `frontend/public/app.css`:
   - Hide inline nav on small widths
   - Show toggle button on small widths
   - Menu panel layout (stacked links/buttons) with clear tap targets
4. Verify the menu does not overlap the task modal in a broken way (if it does, close the menu when opening modal).

## Acceptance criteria
- [ ] On mobile widths, dashboard and settings show a hamburger button and do not show the full inline nav.
- [ ] Tapping the hamburger toggles the menu open/closed.
- [ ] Navigation items inside the menu work (Dashboard, Settings) and Logout still logs out.
- [ ] Language toggle remains reachable on mobile.
- [ ] No horizontal scrolling is introduced by the header on mobile.

## Evidence required
- Screenshots:
  - `docs/exec-plans/completed/sprint-06/evidence/ui/s06-front-card-031-dashboard-menu-closed.png`
  - `docs/exec-plans/completed/sprint-06/evidence/ui/s06-front-card-031-dashboard-menu-open.png`
  - `docs/exec-plans/completed/sprint-06/evidence/ui/s06-front-card-031-settings-menu-open.png`

## Risks
- Focus/keyboard behavior can regress; keep markup simple and ensure the menu button stays focusable.
- Menu layering could clash with the task modal/help panel; verify z-index stacking.

## Verify commands
- `node --check frontend/public/views/dashboard-view.js`
- `node --check frontend/public/views/settings-view.js`
