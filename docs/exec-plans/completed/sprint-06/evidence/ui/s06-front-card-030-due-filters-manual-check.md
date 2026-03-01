#!/usr/bin/env markdown
# FRONT-CARD-030 manual verification

Date: 2026-03-01

## Checks
- Filter row renders on `/app` with:
  - Due-from date input
  - Due-to date input
  - Apply / Clear buttons
- Apply:
  - Setting a valid range triggers a list reload and only shows tasks with a matching due date.
- Clear:
  - Clears inputs and reloads full list.
- Validation:
  - When both bounds are set and `from > to`, the UI shows a banner error and does not call the API.
- Language:
  - Labels/buttons render correctly in ES (default) and EN.

## Evidence
- Mobile screenshot: `docs/exec-plans/completed/sprint-06/evidence/ui/s06-front-card-030-due-filters-mobile.png`
