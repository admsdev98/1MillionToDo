#!/usr/bin/env markdown
# Local setup with Docker (EN)

This guide helps you run the API + frontend locally using Docker Compose.

## Prerequisites
- Docker
- Docker Compose

## Start
1. From the repo root:

   ```bash
   docker compose up --build
   ```

2. Open the app:
   - UI: `http://localhost:3000/`
   - Health: `http://localhost:3000/v1/health`

## Reset the database (destroys local data)
```bash
docker compose down -v
docker compose up --build
```

## Environment variables
Docker Compose sets reasonable defaults in `docker-compose.yml`.

- `JWT_SECRET`
  - Required in Docker because the API runs with `NODE_ENV=production`.
  - Default is a demo value: `dev-insecure-change-this`.
- `DATABASE_URL`
  - Defaults to the Postgres service: `postgres://postgres:postgres@db:5432/todo_app`.
- `PORT`
  - Defaults to `3000`.
- `ALLOW_DEBUG_ENDPOINTS`
  - Optional.
  - Set to `1` to enable a small sample user list at `/v1/debug/users`.

Example:
```bash
JWT_SECRET="local-dev-change-me" ALLOW_DEBUG_ENDPOINTS=1 docker compose up --build
```

## Notes
- Postgres schema is initialized from `db/migrations/*.sql` only when the `postgres_data` volume is new.
- The UI is served by the backend (no separate frontend container).

## Troubleshooting
- If the API starts before Postgres is ready, wait a few seconds and retry (the API has a small connection retry loop).
- If you changed migrations but nothing updates, reset the volume with `docker compose down -v`.
