# FRONT-CARD-024: show task status, tag, and due date in task cards

**Type**: feature
**Priority**: high
**Status**: completed
**Sprint**: 05
**Created**: 2026-02-28
**Started**: 2026-02-28
**Completed**: 2026-02-28

## Goal
Improve task preview cards with the key planning metadata.

## Context
- Users cannot currently see status badges, tags, or due dates in the list view.
- Sprint scope requires quick visual scanning without opening each task.

## Scope (in)
- Add status badge to each card: `Open`, `Done`, or `Overdue`.
- Overdue comparison must use local date against `due_date` (date-only).
- Show tag pill when present.
- Show due date text when present.

## Scope (out)
- Advanced filtering or sorting by status/tag/date.

## Steps
1. Add status computation helper using local date.
2. Add status/tag/due date row to task card preview.
3. Style badges so state is visually clear.

## Acceptance criteria
- [x] Every card shows a status badge.
- [x] Cards with `is_completed=true` show `Done`.
- [x] Incomplete cards with past due date show `Overdue`.
- [x] Cards can show tag and due date preview.

## Evidence to attach when completed
- Manual verification notes and key files changed.

## Evidence
- `docs/exec-plans/completed/sprint-05/evidence/ui/s05-card-024-status-tag-due-date-manual-check.md`

## Code refs
- `frontend/public/features/tasks/task-card.js`
- `frontend/public/app.css`

## Implementation notes

**Approach chosen**: Added task-card level status computation (`Open/Done/Overdue`) using local date comparison and rendered a compact metadata row with status, tag, and due date.
**Alternatives considered**:
- Server-side computed status field: discarded because current API already exposes enough fields and frontend calculation keeps changes minimal.
- Showing metadata only inside modal: discarded because requirement asks for preview visibility on cards.
**Key commands run**: `node --check frontend/public/features/tasks/task-card.js && node --check frontend/public/views/dashboard-view.js` -> syntax checks passed; Playwright dashboard check as owner confirmed Open/Done/Overdue badges plus tag and due date previews.
