# BACK-CARD-002: bootstrap fastify app with db, jwt, and request logger

**Type**: feature
**Priority**: high
**Status**: completed
**Sprint**: 01
**Created**: 2026-02-28
**Completed**: 2026-02-28

## Goal
Create a runnable Fastify backend skeleton (local + Docker) with config, database access, JWT auth wiring, request logging, and a basic health endpoint.

## Context
- `backend/src/**` currently contains placeholders ("Implementation is done via the sprint cards.").
- `docker-compose.yml` and `backend/Dockerfile` already exist and should keep working.

## Scope (in)
- `backend/src/server.js`: start the server, listen on `PORT`, handle shutdown.
- `backend/src/app.js`: create and configure the Fastify instance.
- `backend/src/config.js`: read/validate env vars (`PORT`, `DATABASE_URL`, `JWT_SECRET`).
- Plugins:
  - `backend/src/plugins/db.js` (pg pool via `pg`).
  - `backend/src/plugins/jwt.js` (JWT via `@fastify/jwt`).
  - `backend/src/plugins/request-logger.js` (method/url/timestamp/duration).
  - `backend/src/plugins/serve-frontend-assets.js` (serve `frontend/public/`).
- `GET /v1/health` route.

## Scope (out)
- No auth endpoints implementation (Sprint 01 has a separate card).
- No tasks endpoints implementation (Sprint 01 has a separate card).
- No rate limiting behavior (Sprint 02).

## Steps
1. Implement `config.js` with explicit env parsing and safe defaults for local dev.
2. Implement `app.js` to register plugins, routes, and global error handling shape.
3. Implement `server.js` to start listening and log startup info.
4. Add `/v1/health` returning `{ ok: true }`.
5. Ensure Docker build runs `npm install` and starts the server.

## Acceptance criteria
- [x] Server starts locally and in Docker.
- [x] `/v1/health` responds 200.
- [x] Each request logs method/url/timestamp/duration.

## Evidence
- `npm --prefix backend install` completed successfully with 0 vulnerabilities.
- `node backend/src/server.js` + `curl -i http://localhost:3000/v1/health` returned `HTTP/1.1 200 OK` and `{"ok":true}`.
- `docker compose up --build -d api` built and started `api` and `db`.
- `curl -i http://localhost:3000/v1/health` against Dockerized API returned `HTTP/1.1 200 OK`.
- `docker compose logs api --tail=20` showed request logger output with method/url/timestamp/execution time: `{"method":"GET","url":"/v1/health","timestamp":"...","executionTimeMs":11.5}`.

## Evidence to attach when completed
- `curl -i http://localhost:3000/v1/health` output.
- One example log line showing method/url/timestamp/duration.

## Risks
- Misconfigured `DATABASE_URL` causes startup to fail inside Docker.
- Logging hook can accidentally log secrets if request bodies are printed (avoid logging bodies).

## Test / verify commands (suggested; do not run here)
- `npm --prefix backend install`
- `npm --prefix backend run dev`
- `docker compose up --build`
- `curl -i http://localhost:3000/v1/health`

## Implementation notes

**Approach chosen**: Built a minimal Fastify bootstrap with explicit config parsing, global error shape, reusable DB/JWT setup, and a custom request logger that records the required metadata.
**Alternatives considered**:
- Register all setup modules with `app.register` encapsulation: discarded because sibling route plugins could not reliably reuse shared decorators.
- Add `@fastify/static` for frontend assets: discarded to keep dependencies aligned with the locked stack.
**Key commands run**: `npm --prefix backend install` -> dependencies installed; `node backend/src/server.js` + `curl -i http://localhost:3000/v1/health` -> local health check returned 200; `docker compose up --build -d api` -> containerized API started successfully.
