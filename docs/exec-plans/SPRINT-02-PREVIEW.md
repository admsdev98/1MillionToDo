# Sprint 02 (preview): reset, sharing, limits, ui, docs, hardening

**Status**: preview
**Goal**: Complete the assessment features: password reset demo flow, task sharing with read-only recipients, plan caps + rate limiting, minimal UI, bilingual run instructions, and basic hardening.

## Proposed cards (max 6)
Recommended order (dependencies first):
1. BACK-CARD-005: subscription plans, task caps, and rate limiting
2. BACK-CARD-007: password reset demo flow (request token + reset)
3. BACK-CARD-008: task sharing endpoints and read-only recipient rules
4. FRONT-CARD-006: minimal frontend login, dashboard, and settings
5. DOCS-CARD-009: bilingual run instructions and API examples
6. BACK-CARD-010: hardening (validation, error shape, security basics)

## Notes
- Sprint 02 assumes Sprint 01 delivered a runnable API with auth + owned-task CRUD.
- No new runtime dependencies are planned; use Fastify built-ins and Node core.
