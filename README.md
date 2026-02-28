# SaaS To Do List API (Fastify + Postgres)

This repository contains a technical assessment: a multi-tenant (per user) To Do List API with task sharing, subscription plans, rate limiting, request logging, and a minimal visual frontend.

## Key features
- JWT auth: register/login + password reset (demo token flow)
- Multi-tenancy: tasks are isolated per user
- Task sharing: shared tasks show up for both users (recipients are read-only)
- Tasks CRUD (PATCH for updates)
- Request logging middleware (url/method/timestamp/execution time)
- Plans: `free`, `premium`, `enterprise` (task caps + rate limiting)
- Dockerized (API + Postgres)

## Documentation
- Spanish README: `README.es.md`
- Project norms (EN): `docs/en/`
- Project norms (ES): `docs/es/`
- Execution planning: `docs/exec-plans/`

Setup guides:
- EN: `docs/en/local-docker-setup.md`
- ES: `docs/es/local-docker-setup.md`

## UI screenshots
The UI default language is Spanish (ES). You can switch to English (EN) from the header.

![Landing (desktop)](docs/screenshots/landing-desktop.png)
![Dashboard (desktop)](docs/screenshots/dashboard-desktop.png)
![Task modal](docs/screenshots/task-modal.png)
![Settings](docs/screenshots/settings.png)
![Dashboard (mobile)](docs/screenshots/dashboard-mobile.png)

## Run (Docker)

Prereqs:
- Docker + Docker Compose

Notes:
- Postgres schema init runs via `db/migrations/*.sql` only when the `postgres_data` volume is new.
- The migration enables `pgcrypto` (`CREATE EXTENSION IF NOT EXISTS pgcrypto;`) for UUID generation.

Start:
```bash
docker compose up --build
```

Reset the database volume (destroys local DB data):
```bash
docker compose down -v
docker compose up --build
```

## Env vars
- `JWT_SECRET` (required in Docker because the image uses `NODE_ENV=production`)
- `DATABASE_URL` (defaults to the Docker service DSN)
- `PORT` (defaults to 3000)

## API quickstart (curl)

Register + login:
```bash
curl -s -X POST http://localhost:3000/v1/auth/register \
  -H 'content-type: application/json' \
  -d '{"email":"a@example.com","password":"strong-pass-123"}'

curl -s -X POST http://localhost:3000/v1/auth/login \
  -H 'content-type: application/json' \
  -d '{"email":"a@example.com","password":"strong-pass-123"}'
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

Tasks:
```bash
curl -s http://localhost:3000/v1/tasks \
  -H "Authorization: Bearer $TOKEN"

curl -s -X POST http://localhost:3000/v1/tasks \
  -H 'content-type: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Buy milk"}'

curl -s -X PATCH http://localhost:3000/v1/tasks/$TASK_ID \
  -H 'content-type: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"is_completed":true}'
```

Password reset (demo):
```bash
curl -s -X POST http://localhost:3000/v1/auth/request-password-reset \
  -H 'content-type: application/json' \
  -d '{"email":"a@example.com"}'

curl -s -X POST http://localhost:3000/v1/auth/reset-password \
  -H 'content-type: application/json' \
  -d '{"reset_token":"<token>","new_password":"new-strong-pass-123"}'
```

Sharing:
```bash
curl -s -X POST http://localhost:3000/v1/tasks/$TASK_ID/share \
  -H 'content-type: application/json' \
  -H "Authorization: Bearer $OWNER_TOKEN" \
  -d '{"email":"b@example.com"}'

curl -s -X DELETE http://localhost:3000/v1/tasks/$TASK_ID/share/$RECIPIENT_USER_ID \
  -H "Authorization: Bearer $OWNER_TOKEN"
```
