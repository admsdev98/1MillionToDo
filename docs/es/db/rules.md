# Normas de base de datos (ES)

## Metas
- Schema SQL explicito con constraints e indices.
- Sin ORM.

## Migraciones
- Ruta: `db/migrations/`
- Numeradas e inmutables.
- Nombres autoexplicativos.

## Tablas minimas
- `users`
- `tasks`
- `task_shares`
- `password_reset_tokens`

## Convenciones
- PK uuid.
- Timestamps UTC.
- Unicidad (email, share pairs, token hash).
