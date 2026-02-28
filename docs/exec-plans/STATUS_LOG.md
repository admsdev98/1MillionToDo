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
