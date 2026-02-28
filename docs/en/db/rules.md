# Database rules (EN)

## Goals
- Explicit SQL schema with constraints and indexes.
- No ORM.

## Migrations
- Location: `db/migrations/`
- Numbered and immutable.
- Filenames must be self-explanatory.

## Tables (minimum)
- `users`
- `tasks`
- `task_shares`
- `password_reset_tokens`

## Conventions
- UUID primary keys.
- UTC timestamps.
- Enforce uniqueness (email, share pairs, token hash).
