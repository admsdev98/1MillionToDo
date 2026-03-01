# 1Million ToDo (API + UI)

Proyecto de practica: una API REST multi-tenant (por usuario) para tareas, con un frontend minimo servido por el backend.

Idioma:
- Por defecto: ES
- Alternativo: EN (toggle en el header)

## Funcionalidades
- Registro / login (JWT)
- Restablecer contrasena (flujo demo: devuelve un codigo)
- Tareas: crear, listar, editar, eliminar, marcar completada (PATCH)
- Vencimiento + tags (tags siempre en mayusculas)
- Compartir tareas (destino solo lectura)
- Planes: `free`, `premium`, `enterprise` (limites + rate limiting)
- Ajustes: cambiar plan + ver actividad reciente

## Capturas de la UI
Puedes cambiar a Ingles (EN) desde el header.

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

Abrir:
- UI: http://localhost:3000/
- Health: http://localhost:3000/v1/health

Resetear el volumen de la base (borra datos locales):
```bash
docker compose down -v
docker compose up --build
```

## Variables de entorno
- `JWT_SECRET` (requerido en Docker porque la imagen usa `NODE_ENV=production`)
- `DATABASE_URL` (por defecto apunta al servicio `db`)
- `PORT` (por defecto 3000)

## Guia paso a paso (UI)
1) Crea una cuenta en `Registro`.
2) En `Panel`, crea tareas con vencimiento y tag.
3) Haz click en una tarea para abrir `Detalles` y compartir.
4) En `Ajustes`, cambia el plan y revisa actividad.

## API (opcional)
Registrar + login:
```bash
curl -s -X POST http://localhost:3000/v1/auth/register \
  -H 'content-type: application/json' \
  -d '{"email":"a@example.com","password":"strong-pass-123"}'

curl -s -X POST http://localhost:3000/v1/auth/login \
  -H 'content-type: application/json' \
  -d '{"email":"a@example.com","password":"strong-pass-123"}'
```

Filtrar tareas por vencimiento (inclusive):
```bash
curl -s "http://localhost:3000/v1/tasks?due_from=2026-03-01&due_to=2026-03-07" \
  -H "Authorization: Bearer $TOKEN"
```
