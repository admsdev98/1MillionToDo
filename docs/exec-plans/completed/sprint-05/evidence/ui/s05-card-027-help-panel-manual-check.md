# FRONT-CARD-027 manual check

Date: 2026-02-28

## Validation executed
- Opened `/app` and confirmed floating `Help` button is visible.
- Clicked `Help` button and confirmed panel opens with usage guidance list.
- Verified panel close button hides the panel and keeps dashboard usable.
- With `ALLOW_DEBUG_ENDPOINTS=0`, confirmed graceful fallback message:
  - `Debug users endpoint is disabled. Set ALLOW_DEBUG_ENDPOINTS=1 to enable demo users.`

## Key files touched
- `frontend/public/views/dashboard-view.js`
- `frontend/public/app.css`
