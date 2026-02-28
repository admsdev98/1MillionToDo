# FRONT-CARD-021: add language toggle and simplify landing and register

**Type**: feature
**Priority**: medium
**Status**: completed
**Sprint**: 04
**Created**: 2026-02-28
**Started**: 2026-02-28
**Completed**: 2026-02-28

## Goal
Make the landing and register flows a simpler MVP and add a visible EN/ES language toggle.

## Context
- The landing currently has extra nav buttons and multiple sections.
- Registration lacks confirm password, extra fields, and plan selection.
- Sprint 04 needs the UI to be closer to a simple MVP "wink" to 1millionbot.com.

## Scope (in)
- Landing:
  - Remove top nav links; keep only Login/Register actions.
  - Simplify copy and remove the last sections.
  - Show pricing as three typical plan cards (3 columns on desktop) with features.
- Register:
  - Add confirm password validation (frontend-only).
  - Add one extra field (e.g. workspace name).
  - Add a plan selector and submit `plan` to `/v1/auth/register`.
- Language:
  - Add a UI toggle (EN/ES) visible on landing and auth screens.
  - Use a small frontend dictionary and persist the chosen language.

## Scope (out)
- Full i18n coverage for every message.
- Backend translation.

## Steps
1. Add a minimal `i18n` module (dictionary + `t(key)` + persistence).
2. Update landing structure and copy.
3. Update auth/register view to include confirm password, workspace field, and plan selector.
4. Add screenshots and note the flow.

## Acceptance criteria
- [x] Landing header has only the login/register actions.
- [x] Landing pricing is shown as three plan cards with features.
- [x] Register validates password confirmation and shows an error when mismatched.
- [x] Register can choose plan and registration uses that plan.
- [x] Language toggle switches between EN/ES and persists after refresh.

## Evidence to attach when completed
- Screenshots of landing and register in both languages.

## Evidence
- Manual verification notes: `docs/exec-plans/completed/sprint-04/evidence/ui/s04-front-card-021-manual-verification.md`

## Code refs
- Language dictionary and persistence: `frontend/public/shared/i18n.js`
- Landing update with language toggle: `frontend/public/views/landing-view.js`
- Register improvements and password confirmation validation: `frontend/public/views/auth-view.js`

## Implementation notes

**Approach chosen**: Added a minimal in-browser EN/ES dictionary with persistent language selection and updated landing/register views to use that dictionary while keeping API contracts unchanged.
**Alternatives considered**:
- Server-side translation payloads: discarded because it adds backend coupling for a small static UI surface.
- Full i18n library: discarded because it adds dependency and complexity outside MVP scope.
**Key commands run**: `node --check frontend/public/shared/i18n.js && node --check frontend/public/views/landing-view.js && node --check frontend/public/views/auth-view.js` -> syntax checks passed.
