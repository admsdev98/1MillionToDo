-- Sprint 04: extend tasks with due date (date-only) and a tag.

ALTER TABLE tasks
  ADD COLUMN IF NOT EXISTS due_date date;

ALTER TABLE tasks
  ADD COLUMN IF NOT EXISTS tag text;
