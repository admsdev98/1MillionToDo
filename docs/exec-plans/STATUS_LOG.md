# STATUS_LOG

Use this file as a short decision log to avoid bloating chat context.

Entry template:
- Date: YYYY-MM-DD
- Card: <AREA-CARD-NNN>
- Decision: ...
- Why: ...
- Alternative rejected: ...
- Evidence: ...
- Next: ...

---

- Date: 2026-02-28
- Card: DOCS-PLANNING
- Decision: Use `docs/exec-plans/SPRINT.md` for Sprint 01 (current) and add `docs/exec-plans/SPRINT-02-PREVIEW.md` for Sprint 02.
- Why: The kanban workflow has a single canonical current sprint file; a separate preview keeps Sprint 01 execution unambiguous while still capturing Sprint 02 intent.
- Alternative rejected: Put Sprint 02 as a "Next sprint" section inside `docs/exec-plans/SPRINT.md` (rejected because it blurs what is in-scope for the active sprint and increases the chance the builder picks the wrong card).
- Evidence: `docs/exec-plans/SPRINT.md` + `docs/exec-plans/SPRINT-02-PREVIEW.md`.
- Next: Build Sprint 01 in order (DB -> app skeleton -> auth -> tasks).

- Date: 2026-02-28
- Card: DOCS-PLANNING
- Decision: Sprint 01 focuses on an executable end-to-end backend (docker compose + migrations + auth register/login + request logging + owned-task CRUD); Sprint 02 carries reset/sharing/limits/UI/docs/hardening.
- Why: It produces a verifiable core early and reduces rework by letting later features build on real endpoints.
- Alternative rejected: Implement password reset + sharing in Sprint 01 (rejected to keep Sprint 01 small and ensure a stable base before adding cross-user access rules and token lifecycle logic).
- Evidence: Sprint 01 cards list in `docs/exec-plans/SPRINT.md`.
- Next: Keep Sprint 02 limited to 6 cards and avoid introducing new dependencies.

- Date: 2026-02-28
- Card: DB-CARD-001
- Decision: Keep one explicit bootstrap migration and remove the unused `users.role` column.
- Why: Sprint 01 only needs auth/tasks/share/reset schema primitives and should avoid extra columns not used by acceptance criteria.
- Alternative rejected: Keep `role` for future admin logic (rejected because it introduces out-of-scope behavior before Sprint 02).
- Evidence: `db/migrations/001-create-users-tasks-task-shares-and-password-reset-tables.sql` plus `docker compose exec db psql ... "\\d users"` output.
- Next: Build the Fastify skeleton and health endpoint in BACK-CARD-002.

- Date: 2026-02-28
- Card: BACK-CARD-002
- Decision: Use direct setup functions for DB/JWT/logger to keep shared decorators in one scope and avoid plugin encapsulation surprises.
- Why: This keeps the app understandable for a mid-level developer and avoids adding extra dependencies just for plugin wrapping.
- Alternative rejected: Add `fastify-plugin` and keep everything registered as encapsulated plugins (rejected to keep the locked dependency set minimal).
- Evidence: `backend/src/app.js`, `backend/src/plugins/request-logger.js`, and `docker compose logs api --tail=20`.
- Next: Implement register/login endpoints with `crypto.scrypt` in BACK-CARD-003.

- Date: 2026-02-28
- Card: BACK-CARD-003
- Decision: Use `crypto.scrypt` with per-password random salt and constant-time verify, then issue JWT with `sub`, `userId`, `plan`, and `email`.
- Why: It keeps auth explicit, secure enough for the assessment, and simple for downstream authorization checks.
- Alternative rejected: Use bcrypt dependency (rejected because stack is locked to Node built-in `crypto.scrypt`).
- Evidence: `backend/src/lib/password-scrypt.js`, `backend/src/v1/routes/auth/auth.routes.js`, and curl outputs in the card evidence section.
- Next: Implement owner-scoped tasks CRUD in BACK-CARD-004.

- Date: 2026-02-28
- Card: BACK-CARD-004
- Decision: Scope every task query by `owner_user_id` from JWT and keep PATCH updates explicit via a small allowed-field builder.
- Why: This guarantees strict multi-tenancy and keeps update behavior easy to read for a mid-level developer.
- Alternative rejected: Single generic CRUD helper with dynamic table/column injection (rejected because it increases complexity and risk for this limited scope).
- Evidence: `backend/src/v1/routes/tasks/tasks.routes.js` plus two-user curl walkthrough outputs captured in `/tmp/sprint01-task-*.txt`.
- Next: Sprint 01 complete; move to Sprint 02 pending cards.

- Date: 2026-02-28
- Card: BACK-CARD-002
- Decision: Add startup retry logic in the DB plugin before failing API boot.
- Why: Docker `depends_on` starts containers in order but does not guarantee Postgres accepts connections immediately.
- Alternative rejected: Add a custom wait-for-it shell script in Docker (rejected to keep runtime setup inside Node and avoid extra scripts).
- Evidence: `backend/src/plugins/db.js` and `docker compose up --build -d` now leaves both `db` and `api` in `Up` state.
- Next: Keep this retry behavior for Sprint 02 features that rely on DB at startup.
