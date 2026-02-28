# SaaS To Do List API (Fastify + Postgres)

Este repositorio contiene una prueba tecnica: una API de To Do List multi-tenant (por usuario) con tareas compartidas, planes de suscripcion, rate limiting, logging por request y un frontend visual minimo.

## Funcionalidades
- Auth JWT: register/login + reset password (flujo demo con token)
- Multi-tenancy: tareas aisladas por usuario
- Sharing: tareas compartidas visibles para ambos (receptor solo lectura)
- CRUD de tasks (PATCH para update)
- Middleware logging (url/method/timestamp/tiempo de ejecucion)
- Planes: `free`, `premium`, `enterprise` (limites + rate limiting)
- Docker (API + Postgres)

## Documentacion
- English README: `README.md`
- Normas (EN): `docs/en/`
- Normas (ES): `docs/es/`
- Planificacion/ejecucion: `docs/exec-plans/`

Guias de instalacion:
- EN: `docs/en/local-docker-setup.md`
- ES: `docs/es/local-docker-setup.md`

## Capturas de la UI
La UI usa idioma por defecto Espanol (ES). Puedes cambiar a Ingles (EN) desde el header.

![Landing (desktop)](docs/screenshots/landing-desktop.png)
![Dashboard (desktop)](docs/screenshots/dashboard-desktop.png)
![Task modal](docs/screenshots/task-modal.png)
![Settings](docs/screenshots/settings.png)
![Dashboard (mobile)](docs/screenshots/dashboard-mobile.png)

## Ejecutar (Docker)

Requisitos:
- Docker + Docker Compose

Notas:
- El init del schema de Postgres corre via `db/migrations/*.sql` solo cuando el volumen `postgres_data` es nuevo.
- La migracion habilita `pgcrypto` (`CREATE EXTENSION IF NOT EXISTS pgcrypto;`) para generar UUIDs.

Arrancar:
```bash
docker compose up --build
```

Resetear el volumen de la base (borra datos locales):
```bash
docker compose down -v
docker compose up --build
```

## Variables de entorno
- `JWT_SECRET` (requerido en Docker porque la imagen usa `NODE_ENV=production`)
- `DATABASE_URL` (por defecto apunta al servicio `db`)
- `PORT` (por defecto 3000)

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

Reset password (demo):
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
