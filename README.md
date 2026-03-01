# 1Million ToDo (SaaS To Do API + UI)

A small technical assessment: a multi-tenant (per-user) To Do REST API with a minimal UI served by the backend.

Docs:
- English: `README.md` + `docs/en/local-docker-setup.md`
- Espanol: `README.es.md` + `docs/es/local-docker-setup.md`

## Features
- Auth: register/login with JWT (`@fastify/jwt`)
- Password reset (demo): request token + reset with token (no email provider)
- Multi-tenancy: strict per-user isolation (owner-only writes)
- Tasks: CRUD, updates via PATCH, due date + tag
- Sharing: join table; recipients can read but cannot edit/delete
- Subscription plans: `free`, `premium`, `enterprise`
- Limits: task caps + rate limiting based on plan
- Logging middleware: method + URL + timestamp + execution time
- Dockerized: API + Postgres (frontend assets shipped in the API image)

## Tech stack
- Backend: Node.js + Fastify
- DB: PostgreSQL (UUIDs via `pgcrypto`)
- Driver: `pg`
- Password hashing: `crypto.scrypt` (no bcrypt/argon2 dependency)
- Frontend: vanilla HTML/CSS/JS (served at `/`)

## Project layout
```
backend/
  src/
    v1/routes/
frontend/public/
db/migrations/
docker-compose.yml
```

## Run (Docker)

Prereqs:
- Docker + Docker Compose

Start:
```bash
docker compose up --build
```

Open:
- UI: http://localhost:3000/
- Health: http://localhost:3000/v1/health

Reset the database volume (destroys local DB data):
```bash
docker compose down -v
docker compose up --build
```

Notes:
- Postgres schema init runs via `db/migrations/*.sql` only when the `postgres_data` volume is new.
- UUID generation uses `pgcrypto` (`CREATE EXTENSION IF NOT EXISTS pgcrypto;`).

## Local dev (no Docker)

1. Start Postgres and create a DB (defaults assume `todo_app`).
2. Run migrations from `db/migrations/*.sql`.
3. Start the API:

```bash
cd backend
npm install
npm run dev
```

The UI is still served by the backend at http://localhost:3000/.

## Environment variables
- `PORT` (default: `3000`)
- `DATABASE_URL` (default: `postgres://postgres:postgres@localhost:5432/todo_app`)
- `JWT_SECRET`
  - Required in production (Docker image sets `NODE_ENV=production`).
  - Docker Compose uses a demo default: `dev-insecure-change-this`.
- `ALLOW_DEBUG_ENDPOINTS`
  - Optional.
  - Set to `1` to enable `/v1/debug/users` (also seeds demo users):
    - `demo-free@example.com` / `demo-password-123`
    - `demo-premium@example.com` / `demo-password-123`
    - `demo-enterprise@example.com` / `demo-password-123`

## Plans and limits

Task caps are enforced on *owned* tasks only (shared tasks do not count towards the cap).

| Plan        | Max owned tasks | Rate limit (req/min) |
|-------------|----------------:|----------------------:|
| `free`      |              10 |                    30 |
| `premium`   |              30 |                   120 |
| `enterprise`|             100 |                   600 |

Rate limiting is in-memory (resets on restart). Unauthenticated endpoints use the `free` budget per IP.

## API

Base URL: `http://localhost:3000`

Authentication: pass JWT as `Authorization: Bearer <token>`.

Error shape (all errors):
```json
{
  "error": {
    "code": "SOME_CODE",
    "message": "Human readable message"
  }
}
```

Endpoints:
- `POST /v1/auth/register` -> `{ token }`
- `POST /v1/auth/login` -> `{ token }`
- `POST /v1/auth/request-password-reset` -> `{ reset_token }` (demo)
- `POST /v1/auth/reset-password` -> `{ ok: true }`
- `GET /v1/me` -> `{ id, email, plan }`
- `PATCH /v1/me/plan` -> `{ id, email, plan }`
- `GET /v1/me/request-logs` -> `[{ timestamp, method, url, statusCode, executionTimeMs }]`
- `GET /v1/tasks?due_from=YYYY-MM-DD&due_to=YYYY-MM-DD` -> list owned + shared tasks
- `POST /v1/tasks` -> create (owner)
- `GET /v1/tasks/:id` -> read (owner or shared)
- `PATCH /v1/tasks/:id` -> update (owner only)
- `DELETE /v1/tasks/:id` -> delete (owner only)
- `POST /v1/tasks/:id/share` -> share by recipient email (idempotent)
- `DELETE /v1/tasks/:id/share/:userId` -> unshare
- `GET /v1/users/search?q=<text>` -> search users (for sharing UI)

Task objects include `access: "owner" | "shared"`.

## API quickstart (curl)

Register + login:
```bash
curl -s -X POST http://localhost:3000/v1/auth/register \
  -H 'content-type: application/json' \
  -d '{"email":"a@example.com","password":"strong-pass-123"}'

curl -s -X POST http://localhost:3000/v1/auth/login \
  -H 'content-type: application/json' \
  -d '{"email":"a@example.com","password":"strong-pass-123"}'

# Copy the token from the response.
TOKEN="<paste token here>"

# Optional (if you have jq installed):
# TOKEN="$(curl -s -X POST http://localhost:3000/v1/auth/login \
#   -H 'content-type: application/json' \
#   -d '{"email":"a@example.com","password":"strong-pass-123"}' | jq -r .token)"
```

Me + plan:
```bash
curl -s http://localhost:3000/v1/me \
  -H "Authorization: Bearer $TOKEN"

curl -s -X PATCH http://localhost:3000/v1/me/plan \
  -H 'content-type: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"plan":"premium"}'
```

Create + update a task:
```bash
curl -s -X POST http://localhost:3000/v1/tasks \
  -H 'content-type: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Buy milk","due_date":"2026-03-01","tag":"PERSONAL"}'

# Copy the task id from the response. The UI uppercases tags on blur, the API stores whatever you send.
TASK_ID="<paste task id here>"

curl -s -X PATCH "http://localhost:3000/v1/tasks/$TASK_ID" \
  -H 'content-type: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"is_completed":true}'
```

Filter by due date (inclusive):
```bash
curl -s "http://localhost:3000/v1/tasks?due_from=2026-03-01&due_to=2026-03-07" \
  -H "Authorization: Bearer $TOKEN"
```

Password reset (demo):
```bash
curl -s -X POST http://localhost:3000/v1/auth/request-password-reset \
  -H 'content-type: application/json' \
  -d '{"email":"a@example.com"}'

# Copy the reset_token from the response.
RESET_TOKEN="<paste reset token here>"

curl -s -X POST http://localhost:3000/v1/auth/reset-password \
  -H 'content-type: application/json' \
  -d "{\"reset_token\":\"$RESET_TOKEN\",\"new_password\":\"new-strong-pass-123\"}"
```

Share (recipient is read-only):
```bash
curl -s -X POST http://localhost:3000/v1/tasks/$TASK_ID/share \
  -H 'content-type: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"email":"b@example.com"}'
```

## UI screenshots

The UI default language is Spanish (ES). You can switch to English (EN) from the header.

![Landing (desktop)](docs/screenshots/landing-desktop.png)
![Dashboard (desktop)](docs/screenshots/dashboard-desktop.png)
![Task modal](docs/screenshots/task-modal.png)
![Settings](docs/screenshots/settings.png)
![Dashboard (mobile)](docs/screenshots/dashboard-mobile.png)
