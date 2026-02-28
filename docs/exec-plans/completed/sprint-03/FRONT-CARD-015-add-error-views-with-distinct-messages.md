# CARD-015: Add error views with distinct messages

**Type**: feature
**Priority**: medium
**Status**: completed
**Sprint**: 03
**Created**: 2026-02-28
**Completed**: 2026-02-28

## Goal
Add user-facing error views with distinct copy for not found, forbidden, and unexpected errors.

## Why
When navigation breaks or the API rejects access, the UI should guide the user instead of failing silently.

## Steps
1. Add three error routes: `/error/not-found`, `/error/forbidden`, `/error/unexpected`.
2. Implement a not-found fallback: unknown client-side routes render the not-found view.
3. Render the forbidden view when API calls fail with 401/403 and the user is logged in.
4. Render the unexpected view for other non-OK failures that are not validation errors.
5. Use distinct, human copy (not just status codes) and provide at least one clear next action.

## Acceptance criteria
- [x] The app can render at least three distinct error views with different titles and body copy.
- [x] Unknown routes (e.g. `/does-not-exist`) render the not-found view.
- [x] A simulated 401/403 can be shown as the forbidden view (manual test by clearing JWT and trying `/app`).

## Implementation notes

**Approach chosen**: Added explicit error routes (`/error/not-found`, `/error/forbidden`, `/error/unexpected`) plus a router fallback for unknown paths, so error states are intentional screens with clear next actions.
**Alternatives considered**:
- Showing only inline banners for route and auth failures: discarded because route-level failures need stronger guidance and recovery actions.
- Reusing a single generic error screen for all failures: discarded because the card requires distinct copy and actions per failure type.
**Key commands run**: Playwright navigation to `/does-not-exist` -> rendered not-found view; injected invalid JWT then opened `/app` -> redirected to `/error/forbidden` after backend `401` responses.
