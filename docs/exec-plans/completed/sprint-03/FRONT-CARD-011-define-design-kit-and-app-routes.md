# CARD-011: Define the design kit and app routes

**Type**: feature
**Priority**: high
**Status**: completed
**Sprint**: 03
**Created**: 2026-02-28
**Completed**: 2026-02-28

## Goal
Lock a small, consistent visual system and a route map before changing UI screens.

## Why
Without shared tokens and a route plan, each screen will drift visually and routing changes will be harder to verify.

## Steps
1. Review the current frontend structure in `frontend/public/` and note what must be preserved (no build step, ES modules, existing API client, JWT localStorage).
2. Confirm the minimal tokens from the references and document them in `docs/exec-plans/sprint-03-design-kit.md`.
3. Decide and document the route map and how navigation will work (History API, link interception, back/forward support).
4. Define the minimum component set (buttons, inputs, cards, badges, banner) and how each one maps to the tokens.
5. Update `docs/en/frontend/style-tokens-and-ui-patterns.md` to reflect the confirmed tokens (keep it short and actionable).

## Acceptance criteria
- [x] `docs/exec-plans/sprint-03-design-kit.md` exists and includes: fonts, colors, radius, spacing scale, component notes, and proposed routes.
- [x] `docs/en/frontend/style-tokens-and-ui-patterns.md` matches the confirmed tokens (Inter/Lato, ink `#04274f`, CTA `#ef5350`, pill radius `24px`).
- [x] A single routing decision is written down (chosen + why + one alternative rejected).

## Implementation notes

**Approach chosen**: Finalized the Sprint 03 design kit as the single source of truth and documented URL-based SPA routing (History API) to keep one HTML shell and preserve deep links in the existing no-build setup.
**Alternatives considered**:
- Multi-page HTML routing: discarded because it duplicates layout/styles and increases backend route maintenance.
- Keeping only a high-level draft: discarded because it leaves token/component decisions ambiguous across screens.
**Key commands run**: `grep "Inter|Lato|#04274f|#ef5350|24px" docs/en/frontend/style-tokens-and-ui-patterns.md` -> confirmed required token values are present.
