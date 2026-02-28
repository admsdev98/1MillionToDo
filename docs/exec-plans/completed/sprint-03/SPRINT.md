# Sprint 03: redesign the frontend to match 1millionbot style

**Status**: completed
**Started**: 2026-02-28
**Completed**: 2026-02-28
**Goal**: Redesign the vanilla frontend to match the 1millionbot.com look and feel while keeping the existing no-build setup and API contracts.

## What's included
- A simplified marketing-style landing page at `/` inspired by https://1millionbot.com/.
- Login and register screens inspired by https://app.1millionbot.com/auth/login.
- A modern, common To Do dashboard UI (optional polish) that still uses the existing endpoints and contracts.
- Error views with distinct copy for not found, forbidden, and unexpected failures.
- A small design kit (tokens + components) and a route map.

## What's NOT included
- Any new frontend dependencies (no UI libraries, no build tooling).
- Any API contract changes or new backend endpoints.
- Pixel-perfect cloning of 1millionbot.com or app.1millionbot.com.
- Feature expansion outside the existing screens (e.g. notifications, teams, billing).

## Cards
- [x] FRONT-CARD-011: define design kit and app routes
- [x] FRONT-CARD-012: redesign the landing page
- [x] FRONT-CARD-013: build login and register pages
- [x] FRONT-CARD-014: redesign the To Do dashboard
- [x] FRONT-CARD-015: add error views with distinct messages
- [x] BACK-CARD-016: tighten frontend asset serving and route fallback

## Decisions
### Routing model
Chosen: SPA-style client-side routing using the existing backend catch-all that serves `frontend/public/index.html` for non-`/v1/*` paths.

Why:
- The current frontend is already a single-page app rendered into `#view-root`.
- The backend plugin already provides an `index.html` fallback for `/auth/login`, `/app`, etc.
- This avoids duplicating multiple HTML shells and keeps deployment simple (no build step).

Alternative rejected: multi-page HTML (one file per route) with server-side route handlers.

Why rejected:
- More duplication (shared header/footer/styles), more backend routing surface, and more chances to break deep links.

### Proposed routes
- `/` landing
- `/auth/login` login
- `/auth/register` register
- `/app` dashboard
- `/error/not-found` not found view
- `/error/forbidden` forbidden view
- `/error/unexpected` generic error view
