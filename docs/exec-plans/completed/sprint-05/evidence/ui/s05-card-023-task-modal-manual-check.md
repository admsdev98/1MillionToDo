# FRONT-CARD-023 manual check

Date: 2026-02-28

## Setup
- `docker compose up -d --build`
- Created users `owner-s05@example.com` and `recipient-s05@example.com`.
- Created one owner task and shared it with recipient.

## Validation executed
- Logged in as owner and clicked a task card: detail modal opened.
- In owner modal, verified fields title/description/due date/tag and share-by-email input.
- Ran share action from modal and got banner message `Task shared with recipient-s05@example.com.`.
- Logged in as recipient and opened the shared task modal.
- Verified recipient modal fields are disabled and only close action remains.

## Key files touched
- `frontend/public/views/dashboard-view.js`
- `frontend/public/features/tasks/task-card.js`
- `frontend/public/features/tasks/tasks-api.js`
- `frontend/public/app.css`
