# Normas de backend (ES)

## Metas
- API REST segura por defecto con Fastify.
- Dependencias minimas.
- Multi-tenancy clara.

## Politica de dependencias
Dependencias permitidas en runtime: `fastify`, `@fastify/jwt`, `pg`.
Si se propone una dependencia nueva, anadir una nota corta: que hace y por que es necesaria.

## Convenciones de API
- Prefijo: `/v1`
- Solo JSON.
- Errores estables:
  - `{ "error": { "code": "...", "message": "..." } }`
- Cabecera auth: `Authorization: Bearer <token>`

## Auth
- Register/login devuelven JWT.
- Reset password es un flujo demo:
  - `POST /v1/auth/request-password-reset` devuelve token en la respuesta.
  - `POST /v1/auth/reset-password` consume el token (one-time + expiracion).

## Multi-tenancy y sharing
- Nunca filtrar por `userId` aportado por el cliente.
- Toda operacion de tasks valida acceso: owner o shared.
- Shared recipients: solo lectura (sin edit/delete/share).

## Middleware logging
Para cada request, loguear:
- url
- method
- timestamp
- execution time (ms)

## Planes y limites
Planes: `free`, `premium`, `enterprise`.
- El cap de tasks aplica solo a tareas owned.
- Rate limiting: por usuario (auth) y por IP (unauth).
