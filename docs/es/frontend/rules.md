# Normas de frontend (ES)

## Meta
UI minima pero visual que use endpoints reales del backend (sin mock data).

## Pantallas
- Login/Register (toggle en una vista)
- Dashboard (lista tasks + crear + marcar completed; mostrar shared)
- Settings (opcional): ver plan + upgrade/downgrade demo + logout

## Organizacion (simple y modular)
- `frontend/public/shared/`: api client, auth store, helpers DOM
- `frontend/public/login/`: login view
- `frontend/public/dashboard/`: dashboard view + task card + tasks api
- `frontend/public/settings/`: settings view

## Reglas
- Vanilla HTML/CSS/JS. Sin build.
- JWT en `localStorage`.
- Llamadas HTTP centralizadas en un API client.
- Mobile-first y focus accesible.
