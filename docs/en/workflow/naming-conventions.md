# Naming conventions (EN)

Everything should be understandable from the name alone.

## Areas
Use these prefixes in cards and titles:
- BACK, FRONT, DB, DOCS, FIX

## Cards
`<AREA>-CARD-<NNN>-<clear-description>.md`

Example:
- `BACK-CARD-004-add-tasks-crud-with-task-sharing.md`

## Branches
`sprint-xx-<area>-<clear-description>`

Example:
- `sprint-01-frontend-add-login-and-dashboard-screens`

## Commits
`type/short-clear-description`

Example:
- Subject: `backend/enforce-task-access-checks` (or `fix/...`, `docs/...`, `db/...`)
- Body:
  - `- BACK-CARD-004`
  - `- Enforce owner/shared access rules`
