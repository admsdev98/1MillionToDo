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
