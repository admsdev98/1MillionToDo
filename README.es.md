# 1Million ToDo (SaaS To Do API + UI)

Un assessment tecnico pequeno: una API REST multi-tenant (por usuario) para tareas, con una UI minima servida por el backend.

Docs:
- Ingles: `README.md` + `docs/en/local-docker-setup.md`
- Espanol: `README.es.md` + `docs/es/local-docker-setup.md`

## Funcionalidades
- Auth: registro/login con JWT (`@fastify/jwt`)
- Reset de contrasena (demo): pedir token + reset con token (sin proveedor de email)
- Multi-tenancy: aislamiento estricto por usuario (solo el owner puede escribir)
- Tareas: CRUD, updates via PATCH, vencimiento + tag
- Compartir: join table; el destinatario puede leer pero no puede editar/eliminar
- Planes: `free`, `premium`, `enterprise`
- Limites: cap de tareas + rate limiting por plan
- Logging middleware: method + URL + timestamp + execution time
- Docker: API + Postgres (assets del frontend incluidos en la imagen de la API)

## Stack
- Backend: Node.js + Fastify
- DB: PostgreSQL (UUIDs via `pgcrypto`)
- Driver: `pg`
- Password hashing: `crypto.scrypt` (sin dependencia de bcrypt/argon2)
- Frontend: HTML/CSS/JS vanilla (servido en `/`)

## Estructura del proyecto
```
backend/
  src/
    v1/routes/
frontend/public/
db/migrations/
docker-compose.yml
```

## Ejecutar (Docker)

Requisitos:
- Docker + Docker Compose

Arrancar:
```bash
docker compose up --build
```

Abrir:
- UI: http://localhost:3000/
- Health: http://localhost:3000/v1/health

Resetear el volumen de la base (borra datos locales):
```bash
docker compose down -v
docker compose up --build
```

Notas:
- El schema de Postgres se inicializa desde `db/migrations/*.sql` solo cuando el volumen `postgres_data` es nuevo.
- La generacion de UUID usa `pgcrypto` (`CREATE EXTENSION IF NOT EXISTS pgcrypto;`).

## Desarrollo local (sin Docker)

1. Levanta Postgres y crea una DB (por defecto asume `todo_app`).
2. Ejecuta migraciones desde `db/migrations/*.sql`.
3. Arranca la API:

```bash
cd backend
npm install
npm run dev
```

La UI se sirve igual desde el backend en http://localhost:3000/.

## Variables de entorno
- `PORT` (default: `3000`)
- `DATABASE_URL` (default: `postgres://postgres:postgres@localhost:5432/todo_app`)
- `JWT_SECRET`
  - Requerido en produccion (la imagen Docker setea `NODE_ENV=production`).
  - Docker Compose usa un valor demo: `dev-insecure-change-this`.
- `ALLOW_DEBUG_ENDPOINTS`
  - Opcional.
  - Setea `1` para habilitar `/v1/debug/users` (y crea usuarios demo):
    - `demo-free@example.com` / `demo-password-123`
    - `demo-premium@example.com` / `demo-password-123`
    - `demo-enterprise@example.com` / `demo-password-123`

## Planes y limites

El cap de tareas se aplica solo a tareas *propias* (las tareas compartidas no cuentan para el cap).

| Plan        | Max tareas propias | Rate limit (req/min) |
|-------------|-------------------:|----------------------:|
| `free`      |                 10 |                    30 |
| `premium`   |                 30 |                   120 |
| `enterprise`|                100 |                   600 |

El rate limiting es in-memory (se resetea al reiniciar). Endpoints no autenticados usan el presupuesto de `free` por IP.

## API

Base URL: `http://localhost:3000`

Auth: pasa el JWT como `Authorization: Bearer <token>`.

Formato de error (todos los errores):
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
- `GET /v1/tasks?due_from=YYYY-MM-DD&due_to=YYYY-MM-DD` -> lista tareas propias + compartidas
- `POST /v1/tasks` -> crear (owner)
- `GET /v1/tasks/:id` -> leer (owner o compartida)
- `PATCH /v1/tasks/:id` -> actualizar (solo owner)
- `DELETE /v1/tasks/:id` -> eliminar (solo owner)
- `POST /v1/tasks/:id/share` -> compartir por email (idempotente)
- `DELETE /v1/tasks/:id/share/:userId` -> dejar de compartir
- `GET /v1/users/search?q=<text>` -> buscar usuarios (para el UI de compartir)

Los objetos de tarea incluyen `access: "owner" | "shared"`.

## API quickstart (curl)

Registro + login:
```bash
curl -s -X POST http://localhost:3000/v1/auth/register \
  -H 'content-type: application/json' \
  -d '{"email":"a@example.com","password":"strong-pass-123"}'

curl -s -X POST http://localhost:3000/v1/auth/login \
  -H 'content-type: application/json' \
  -d '{"email":"a@example.com","password":"strong-pass-123"}'

# Copia el token desde la respuesta.
TOKEN="<pega el token aqui>"

# Opcional (si tienes jq instalado):
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

Crear + actualizar una tarea:
```bash
curl -s -X POST http://localhost:3000/v1/tasks \
  -H 'content-type: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Buy milk","due_date":"2026-03-01","tag":"PERSONAL"}'

# Copia el task id desde la respuesta. La UI pasa el tag a MAYUS al hacer blur, la API guarda lo que envies.
TASK_ID="<pega el task id aqui>"

curl -s -X PATCH "http://localhost:3000/v1/tasks/$TASK_ID" \
  -H 'content-type: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"is_completed":true}'
```

Filtrar por vencimiento (inclusive):
```bash
curl -s "http://localhost:3000/v1/tasks?due_from=2026-03-01&due_to=2026-03-07" \
  -H "Authorization: Bearer $TOKEN"
```

Reset de contrasena (demo):
```bash
curl -s -X POST http://localhost:3000/v1/auth/request-password-reset \
  -H 'content-type: application/json' \
  -d '{"email":"a@example.com"}'

# Copia el reset_token desde la respuesta.
RESET_TOKEN="<pega el reset token aqui>"

curl -s -X POST http://localhost:3000/v1/auth/reset-password \
  -H 'content-type: application/json' \
  -d "{\"reset_token\":\"$RESET_TOKEN\",\"new_password\":\"new-strong-pass-123\"}"
```

Compartir (el destinatario es read-only):
```bash
curl -s -X POST http://localhost:3000/v1/tasks/$TASK_ID/share \
  -H 'content-type: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"email":"b@example.com"}'
```

## Capturas de la UI

El idioma por defecto es Espanol (ES). Puedes cambiar a Ingles (EN) desde el header.

![Landing (desktop)](docs/screenshots/landing-desktop.png)
![Dashboard (desktop)](docs/screenshots/dashboard-desktop.png)
![Task modal](docs/screenshots/task-modal.png)
![Settings](docs/screenshots/settings.png)
![Dashboard (mobile)](docs/screenshots/dashboard-mobile.png)
