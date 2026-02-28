# CARD-013: Build login and register pages

**Type**: feature
**Priority**: high
**Status**: completed
**Sprint**: 03
**Created**: 2026-02-28
**Completed**: 2026-02-28

## Goal
Create `/auth/login` and `/auth/register` screens inspired by the app.1millionbot.com auth layout, but using the Sprint 03 design kit.

## Why
Auth is the first interactive flow; it must look and feel like the product, not a placeholder form.

## Steps
1. Implement client-side routes for `/auth/login` and `/auth/register` and ensure back/forward navigation works.
2. Build an auth layout with a clear hierarchy (optional left panel message/visual on desktop; single column on mobile).
3. Wire login and register to the existing endpoints (`/v1/auth/login`, `/v1/auth/register`) and store the JWT using the existing auth store.
4. Add clear error messaging using the shared banner/toast pattern.
5. Add a visible link for password reset entry (route can be a placeholder until implemented).

## Acceptance criteria
- [x] `/auth/login` and `/auth/register` render distinct screens with consistent styles.
- [x] Successful login/register stores the JWT and navigates to `/app`.
- [x] Invalid credentials and validation errors show a readable error message.
- [x] Keyboard-only navigation works (focus ring visible, tab order sensible).

## Implementation notes

**Approach chosen**: Implemented dedicated SPA routes for login and register with one shared auth layout component, so both screens stay visually consistent while keeping route-specific copy, endpoint targets, and links.
**Alternatives considered**:
- Reusing the old mode toggle in a single `/auth/login` route: discarded because the card requires distinct URL routes.
- Splitting login and register into two separate duplicated view files: discarded to avoid style drift and duplicated validation logic.
**Key commands run**: `curl -i -X POST /v1/auth/login (invalid credentials)` -> returned readable `401 Invalid credentials`; Playwright register flow -> navigated to `/app` with `todo.jwt` persisted in localStorage.
