#!/usr/bin/env markdown
# Instalacion local con Docker (ES)

Esta guia sirve para levantar la API + el frontend en local con Docker Compose.

## Requisitos
- Docker
- Docker Compose

## Arrancar
1. Desde la raiz del repo:

   ```bash
   docker compose up --build
   ```

2. Abrir la app:
   - UI: `http://localhost:3000/`
   - Health: `http://localhost:3000/v1/health`

## Resetear la base (borra datos locales)
```bash
docker compose down -v
docker compose up --build
```

## Variables de entorno
Docker Compose ya incluye valores por defecto en `docker-compose.yml`.

- `JWT_SECRET`
  - Requerido en Docker porque la API corre con `NODE_ENV=production`.
  - El valor por defecto es de demo: `dev-insecure-change-this`.
- `DATABASE_URL`
  - Por defecto apunta a Postgres dentro de Docker: `postgres://postgres:postgres@db:5432/todo_app`.
- `PORT`
  - Por defecto `3000`.
- `ALLOW_DEBUG_ENDPOINTS`
  - Opcional.
  - Si lo pones a `1`, habilita una lista de usuarios de ejemplo en `/v1/debug/users`.

Ejemplo:
```bash
JWT_SECRET="local-dev-change-me" ALLOW_DEBUG_ENDPOINTS=1 docker compose up --build
```

## Notas
- El schema de Postgres se inicializa desde `db/migrations/*.sql` solo cuando el volumen `postgres_data` es nuevo.
- El frontend lo sirve el backend (no hay contenedor separado para el frontend).

## Problemas comunes
- Si la API arranca antes de que Postgres acepte conexiones, espera unos segundos y reintenta (la API tiene reintentos).
- Si cambiaste migraciones y no se aplican, resetea el volumen con `docker compose down -v`.
