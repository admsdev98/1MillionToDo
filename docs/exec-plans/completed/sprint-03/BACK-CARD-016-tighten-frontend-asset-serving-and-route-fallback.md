# CARD-016: Tighten frontend asset serving and route fallback

**Type**: feature
**Priority**: high
**Status**: completed
**Sprint**: 03
**Created**: 2026-02-28
**Completed**: 2026-02-28

## Goal
Make frontend asset serving predictable (correct content types, correct 404 behavior for missing assets) while keeping SPA deep links working.

## Why
The current catch-all route returns `index.html` even for missing files, which can hide real asset problems and make debugging harder.

## Steps
1. Update `backend/src/plugins/serve-frontend-assets.js` so missing assets (requests that look like files, e.g. contain an extension) return a real 404 instead of `index.html`.
2. Keep the SPA fallback for HTML routes so deep links like `/auth/login` and `/app` still load.
3. Expand `CONTENT_TYPES` to include common frontend files that may be added during the redesign (e.g. `.ico`, `.woff2`, `.woff`, `.webp`).
4. Ensure `/v1/*` behavior stays unchanged (API routes must not be shadowed by the frontend handler).

## Acceptance criteria
- [x] A request for an existing asset (e.g. `/app.css`) returns the correct content type.
- [x] A request for a missing asset (e.g. `/missing.css`) returns HTTP 404 (not `index.html`).
- [x] A deep link like `/auth/login` still returns `index.html` and the UI can render the login view.
- [x] `/v1/*` routes are not intercepted by the frontend catch-all.

## Implementation notes

**Approach chosen**: Kept the SPA fallback for extensionless routes and added an explicit guard for file-like paths so missing assets return Fastify 404 instead of silently returning `index.html`.
**Alternatives considered**:
- Always returning `index.html` for missing files: discarded because it hides missing-asset bugs.
- Returning custom HTML 404 for assets: discarded because global API-style 404 keeps behavior consistent and explicit.
**Key commands run**: `curl -i http://localhost:3000/missing.css` -> returned `HTTP/1.1 404 Not Found` with JSON error body.
