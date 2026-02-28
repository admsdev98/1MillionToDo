# CARD-014: Redesign the To Do dashboard

**Type**: feature
**Priority**: medium
**Status**: completed
**Sprint**: 03
**Created**: 2026-02-28
**Completed**: 2026-02-28

## Goal
Redesign the `/app` dashboard into a modern, common To Do layout while keeping the existing functionality and contracts.

## Why
The current dashboard is functional but not aligned with the product look and does not feel like a real app.

## Steps
1. Implement the `/app` route (and optional `/app/settings`) and ensure auth gating redirects to `/auth/login` when logged out.
2. Rebuild the dashboard layout (header + main content) using the design kit tokens.
3. Keep the existing task behaviors: list, create, mark complete, and show owned/shared badges.
4. Ensure shared tasks remain read-only (no completion toggle).
5. Add small polish only if time allows (empty states, loading state, subtle motion).

## Acceptance criteria
- [x] Visiting `/app` while logged in shows the dashboard; while logged out redirects to `/auth/login`.
- [x] Tasks list, create, and patch completion still work against the real backend.
- [x] Shared tasks are clearly labeled and remain read-only.
- [x] Dashboard looks consistent with the landing/auth design kit.

## Implementation notes

**Approach chosen**: Rebuilt `/app` as a modern two-panel layout (task list + create form) with shared styling tokens and explicit auth gating in the router so logged-out access always lands on `/auth/login`.
**Alternatives considered**:
- Keeping the previous dashboard card layout and only restyling colors: discarded because it did not align with the new landing/auth hierarchy.
- Allowing shared tasks to be toggled and relying on backend rejection: discarded because disabling controls in the UI reduces user confusion.
**Key commands run**: Playwright flow on `/app` -> created a task, toggled completion, and confirmed shared task checkbox is disabled; `curl /v1/tasks` after UI actions -> showed `is_completed:true` for the updated task.
