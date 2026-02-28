# CARD-012: Redesign the landing page

**Type**: feature
**Priority**: high
**Status**: completed
**Sprint**: 03
**Created**: 2026-02-28
**Completed**: 2026-02-28

## Goal
Create a simplified landing page at `/` that feels like 1millionbot.com (tone, layout, CTA style) while remaining lightweight.

## Why
The assessment needs a first impression that matches the product direction and makes the demo feel intentional.

## Steps
1. Replace the current logged-in app shell on `/` with a landing layout when the user is logged out.
2. Implement a top navigation similar in spirit to 1millionbot.com (logo/wordmark, a few links, one primary CTA).
3. Build a hero section with a strong headline (display font) and a single primary CTA leading to `/auth/login`.
4. Add 2-4 short sections (benefits, how it works, plan highlights, or trust row) using the design kit tokens.
5. Ensure mobile-first layout, accessible focus states, and no layout shift on load.

## Acceptance criteria
- [x] Visiting `/` while logged out shows the landing page (not the task dashboard).
- [x] The primary CTA uses the design kit (red fill, pill radius) and navigates to `/auth/login`.
- [x] Layout is readable on 360px width and on desktop.
- [x] No new dependencies are introduced and assets are served from `frontend/public/`.

## Implementation notes

**Approach chosen**: Replaced the static app shell with a route-driven landing page that always renders at `/` and keeps a clear marketing structure (header, hero, benefits, workflow, plans) using the Sprint 03 design tokens.
**Alternatives considered**:
- Keeping the old topbar shell and injecting landing inside the previous card container: discarded because it looked inconsistent with the new visual direction.
- Redirecting `/` directly to `/auth/login`: discarded because the card requires a real landing experience for logged-out visits.
**Key commands run**: `curl -i http://localhost:3000/` -> returned `200 text/html`; `playwright screenshot s03-landing-mobile-360.png` -> verified 360px readability.
