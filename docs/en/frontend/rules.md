# Frontend rules (EN)

## Goal
Minimal but visual UI that uses real backend endpoints (no mock data).

## Screens
- Login/Register (toggle in one view)
- Dashboard (tasks list + create + mark complete; show shared tasks)
- Settings (optional): show plan + upgrade/downgrade demo + logout

## Code organization (simple, modular)
- `frontend/public/shared/`: api client, auth store, small DOM helpers
- `frontend/public/login/`: login view
- `frontend/public/dashboard/`: dashboard view + task card + tasks api
- `frontend/public/settings/`: settings view

## Rules
- Vanilla HTML/CSS/JS. No build step.
- Store JWT in `localStorage`.
- Centralize HTTP calls in a single API client.
- Mobile-first and accessible focus states.
