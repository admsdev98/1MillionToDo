# Convenciones de nombres (ES)

La idea es que se entienda el que y el por que solo con el nombre.

## Areas
Prefijos para cards y titulos:
- BACK, FRONT, DB, DOCS, FIX

## Cards
`<AREA>-CARD-<NNN>-<descripcion-clara>.md`

Ejemplo:
- `BACK-CARD-004-add-tasks-crud-with-task-sharing.md`

## Ramas
`sprint-xx-<area>-<descripcion-clara>`

Ejemplo:
- `sprint-01-frontend-add-login-and-dashboard-screens`

## Commits
`type/short-clear-description`

Ejemplo:
- Asunto: `backend/enforce-task-access-checks` (o `fix/...`, `docs/...`, `db/...`)
- Cuerpo:
  - `- BACK-CARD-004`
  - `- Enforce owner/shared access rules`
