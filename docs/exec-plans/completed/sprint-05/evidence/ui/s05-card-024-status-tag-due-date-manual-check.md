# FRONT-CARD-024 manual check

Date: 2026-02-28

## Validation executed
- Rebuilt API image and opened `/app` as owner user.
- Confirmed each task card now shows a status badge.
- Verified one completed task renders `Done`.
- Verified one incomplete past-date task renders `Overdue`.
- Verified task preview row shows `tag` and formatted due date.

## Example observed cards
- `Done task sample` -> `Done` + tag `done` + due date shown.
- `Overdue task sample` -> `Overdue` + tag `old` + due date shown.
- `Card 023 owner task` -> `Open` + tag `demo` + due date shown.

## Key files touched
- `frontend/public/features/tasks/task-card.js`
- `frontend/public/app.css`
