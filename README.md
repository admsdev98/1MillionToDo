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
