# Sprint 04: complete missing frontend functionality

**Status**: completed
**Started**: 2026-02-28
**Completed**: 2026-02-28
**Goal**: Close the remaining frontend gaps (landing/auth/dashboard/settings/help) and add the minimal DB/API support for due dates, tags, plan selection at register, and in-app log viewing.

## Canonical source
- This file is the archived Sprint 04 plan.
- Sprint 05 execution is now tracked in `docs/exec-plans/SPRINT.md`.

## What's included
- Landing MVP simplification + pricing layout + language toggle.
- Auth register improvements: confirm password (frontend), workspace field (frontend), and plan selection (backend).
- Dashboard: due date and tag support at API level.
- Settings/logs backend support (`PATCH /v1/me/plan` and `GET /v1/me/request-logs`).
- Debug-only user list endpoint for demo support.

## What's NOT included
- Any new frontend dependencies (no UI libraries, no build tooling).
- Real payments/billing.
- Persistent log storage in the database.
- Advanced task features (attachments, recurring tasks, complex filters).

## Cards
- [x] BACK-CARD-017: add plan selection to register endpoint
- [x] DB-CARD-018: add due date and tag to tasks table
- [x] BACK-CARD-019: support due date and tag in task endpoints
- [x] BACK-CARD-020: add request logs endpoint and dev user list
- [x] FRONT-CARD-021: add language toggle and simplify landing and register
- [x] FRONT-CARD-022: add dashboard modals, edit/delete, status, settings, and help (**cancelled/superseded by Sprint 05 cards 023-027**)

## Carryover to Sprint 05
- FRONT-CARD-022 was too broad and was split into focused cards:
  - FRONT-CARD-023
  - FRONT-CARD-024
  - FRONT-CARD-025
  - FRONT-CARD-026
  - FRONT-CARD-027

## Definition of done
- Backend/DB enablers for due date, tag, register plan selection, request logs, and debug users are delivered.
- Landing/auth MVP updates (CARD-021) are delivered with evidence.
- The oversized CARD-022 is explicitly cancelled and replaced by Sprint 05 focused cards.
