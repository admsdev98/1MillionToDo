# FRONT-CARD-027: add floating help panel for demo users and sharing

**Type**: feature
**Priority**: medium
**Status**: completed
**Sprint**: 05
**Created**: 2026-02-28
**Started**: 2026-02-28
**Completed**: 2026-02-28

## Goal
Provide an in-app help surface for demo users and sharing guidance.

## Context
- Dashboard currently has no contextual guidance.
- Sprint scope asks for a floating help panel and optional debug user list.

## Scope (in)
- Add floating Help button to dashboard.
- Add Help panel with short instructions for create/share/read-only behavior.
- Try loading `/v1/debug/users` for demo users/plans.
- Fallback gracefully when debug endpoint is unavailable.

## Scope (out)
- Full onboarding tour.
- Persistent per-user panel state.

## Steps
1. Add floating help trigger and panel UI.
2. Populate static usage guidance text.
3. Fetch debug users list and handle 404/disabled state without errors.

## Acceptance criteria
- [x] Dashboard shows a floating Help button.
- [x] Help panel opens and closes without breaking dashboard interactions.
- [x] Help panel includes concise usage guidance for demo flows.
- [x] Debug users list is shown when endpoint is enabled, and fallback message appears otherwise.

## Evidence to attach when completed
- Manual verification notes and key files changed.

## Evidence
- `docs/exec-plans/completed/sprint-05/evidence/ui/s05-card-027-help-panel-manual-check.md`

## Code refs
- `frontend/public/views/dashboard-view.js`
- `frontend/public/app.css`

## Implementation notes

**Approach chosen**: Added a floating Help button with a small slide-up panel that includes fixed demo guidance and a one-time attempt to load `/v1/debug/users`.
**Alternatives considered**:
- Dedicated Help route: discarded because requirement asks for floating in-dashboard help.
- Always call debug endpoint on every open: discarded to avoid unnecessary repeated requests and noise.
**Key commands run**: `node --check frontend/public/views/dashboard-view.js` -> syntax check passed; Playwright dashboard interaction verified open/close behavior and graceful 404 fallback message for `/v1/debug/users`.
