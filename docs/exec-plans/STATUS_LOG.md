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

- Date: 2026-02-28
- Card: SPRINT-02-PLANNING
- Decision: Promote `docs/exec-plans/SPRINT.md` as the only canonical Sprint 02 plan and deprecate `SPRINT-02-PREVIEW.md`.
- Why: One canonical sprint file prevents execution drift and card-order confusion.
- Alternative rejected: Keep dual sources (`SPRINT.md` + preview) as active references (rejected because it can split decisions and acceptance criteria).
- Evidence: `docs/exec-plans/SPRINT.md` and `docs/exec-plans/SPRINT-02-PREVIEW.md`.
- Next: Start Sprint 02 work from `BACK-CARD-010`.

- Date: 2026-02-28
- Card: SPRINT-02-PLANNING
- Decision: Lock JSON contract to snake_case and use `access: "owner" | "shared"` as the shared-task marker.
- Why: A single naming style across backend/frontend/docs reduces mapping bugs and removes `isShared` vs `is_shared` ambiguity.
- Alternative rejected: Keep mixed naming (`camelCase` in some payloads) (rejected because it increases front-end adapters and test complexity).
- Evidence: `docs/exec-plans/SPRINT.md`, `docs/exec-plans/pending/BACK-CARD-008-task-sharing-endpoints-and-read-only-recipients.md`, and `docs/exec-plans/pending/FRONT-CARD-006-minimal-frontend-login-dashboard-settings.md`.
- Next: Enforce this contract in route schemas before feature implementation.

- Date: 2026-02-28
- Card: SPRINT-02-PLANNING
- Decision: Enforce plan limits from database state and lock error codes `PLAN_LIMIT_REACHED` (403) and `RATE_LIMITED` (429).
- Why: JWT plan claims can be stale after plan change, so DB-backed enforcement is the only reliable source.
- Alternative rejected: Trust JWT `plan` claim for limit decisions (rejected because plan updates would require re-login to take effect).
- Evidence: `docs/exec-plans/SPRINT.md` and `docs/exec-plans/pending/BACK-CARD-005-subscription-plans-task-caps-and-rate-limiting.md`.
- Next: Validate behavior with curl evidence after implementation.

- Date: 2026-02-28
- Card: SPRINT-02-PLANNING
- Decision: Make schemas mandatory for Sprint 02 routes and lock one error response shape with stable codes.
- Why: This creates a predictable quality gate for frontend integration and docs examples.
- Alternative rejected: Add schemas incrementally per route without a locked contract (rejected because behavior could drift across cards).
- Evidence: `docs/exec-plans/SPRINT.md` and `docs/exec-plans/pending/BACK-CARD-010-hardening-validation-error-shapes-and-security-basics.md`.
- Next: Implement this in BACK-CARD-010 before other backend cards.

- Date: 2026-02-28
- Card: SPRINT-02-PLANNING
- Decision: Document `pgcrypto` prerequisite and Docker volume reset behavior as part of Sprint 02 docs acceptance.
- Why: Migration/init changes and existing local volumes can hide setup errors during evaluation.
- Alternative rejected: Keep migration troubleshooting implicit in code only (rejected because assessors need reproducible setup steps).
- Evidence: `docs/exec-plans/SPRINT.md` and `docs/exec-plans/pending/DOCS-CARD-009-bilingual-run-instructions-and-api-examples.md`.
- Next: Add exact commands and notes in README updates during DOCS-CARD-009.

- Date: 2026-02-28
- Card: BACK-CARD-005
- Decision: Use a simple fixed-window in-memory rate limiter keyed by `user:<id>` (auth) and `ip:<addr>` (unauth), with budgets derived from DB-backed plan.
- Why: It satisfies the assessment without extra dependencies (no Redis) and keeps the logic readable for a mid-level developer.
- Alternative rejected: Token-bucket or leaky-bucket with distributed storage (rejected as overkill for the locked stack and would require extra infra).
- Evidence: `backend/src/plugins/rate-limit.js`, `backend/src/lib/plan-limits.js`, and `docs/exec-plans/completed/sprint-02/evidence/api/s02-rate-limited.txt`.
- Next: Document the "resets on restart" limitation in the README (done in DOCS-CARD-009).

- Date: 2026-02-28
- Card: BACK-CARD-007
- Decision: Store only a SHA-256 hash of the reset token and consume it in a DB transaction with `SELECT ... FOR UPDATE`.
- Why: It prevents raw token storage and avoids race conditions around one-time use.
- Alternative rejected: Store the raw token for simpler debugging (rejected because it is a bad security habit even in a demo).
- Evidence: `backend/src/v1/routes/auth/password-reset.routes.js` and `docs/exec-plans/completed/sprint-02/evidence/api/s02-reset-db-before.txt` + `docs/exec-plans/completed/sprint-02/evidence/api/s02-reset-db-after.txt`.
- Next: Keep the reset-request endpoint anti-enumeration behavior (always 200) (implemented).

- Date: 2026-02-28
- Card: BACK-CARD-010
- Decision: Add minimal security headers via an `onSend` hook and require a non-default `JWT_SECRET` in production.
- Why: It raises baseline security without adding dependencies.
- Alternative rejected: Add `@fastify/helmet` (rejected to keep dependencies aligned with the locked stack).
- Evidence: `backend/src/plugins/security-headers.js`, `backend/src/config.js`, and `docs/exec-plans/completed/sprint-02/evidence/api/s02-health.txt`.
- Next: Keep error code contracts stable by using `error.errorCode` when needed (implemented in `backend/src/app.js`).

- Date: 2026-02-28
- Card: SPRINT-04-PLANNING
- Decision: Create Sprint 04 to finish missing frontend MVP functionality and add minimal DB/API support (due dates, tags, register plan, in-app logs).
- Why: The UI requirements require data fields and endpoints that do not exist yet; keeping them in one sprint avoids partial UX.
- Alternative rejected: Implement UI only with placeholders (rejected because it would misrepresent capabilities and increase rework).
- Evidence: `docs/exec-plans/SPRINT.md` and Sprint 04 cards in `docs/exec-plans/pending/`.
- Next: Start with BACK-CARD-017, then DB-CARD-018, then BACK-CARD-019.

- Date: 2026-02-28
- Card: DB-CARD-018
- Decision: Implement task due dates as a date-only value (`YYYY-MM-DD`) stored as Postgres `date`.
- Why: The requirement is a deadline day; date-only avoids timezone bugs and simplifies the UI.
- Alternative rejected: Use `timestamptz` (rejected because timezones add complexity for MVP).
- Evidence: `docs/exec-plans/SPRINT.md` decisions section and `docs/exec-plans/pending/DB-CARD-018-add-due-date-and-tag-to-tasks-table.md`.
- Next: Extend the task API schema and payloads to accept/return `due_date`.

- Date: 2026-02-28
- Card: FRONT-CARD-022
- Decision: Cancel CARD-022 and split it into FRONT-CARD-023 through FRONT-CARD-027 for Sprint 05.
- Why: CARD-022 mixed five UI deliverables, making verification and one-card kanban execution too risky.
- Alternative rejected: Keep one large card and finish it in one pass (rejected because acceptance evidence would be weak and failures would be harder to isolate).
- Evidence: `docs/exec-plans/completed/sprint-04/FRONT-CARD-022-add-dashboard-modals-edit-delete-status-settings-and-help.md` and new cards in `docs/exec-plans/pending/`.
- Next: Execute Sprint 05 cards in order (023 -> 027) with per-card evidence files.
