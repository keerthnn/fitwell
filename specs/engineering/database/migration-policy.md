---
id: database-migration-policy
title: Database Migration Policy and Current History
status: active
authority: operational
requirements: [DATA-003]
decisions: [ADR-0004]
code: [prisma/schema.prisma, prisma/migrations/, prisma.config.ts, scripts/assert-local-database.mjs, package.json]
tests: []
last_verified: 2026-08-15
---

# Database migration policy and current history

## Current mechanism

Prisma owns schema evolution for PostgreSQL. `prisma.config.ts` points at `prisma/schema.prisma`, `prisma/migrations/`, and `DATABASE_URL`. The committed history contains the initial FitWell schema, feedback conversations, and the later `CLOSED` enum value. The schema is generated during build/postinstall and migration deployment is exposed as `pnpm run db:migrate:deploy`.

## Binding workflow

1. Classify the change; destructive, relationship, ownership, retention, and substantial backfill changes require Full SDD.
2. Edit the schema and generate a new migration locally against an explicitly verified local target.
3. Review generated SQL, locks, constraints, defaults, referential actions, indexes, and existing-row compatibility.
4. Exercise the migration on representative non-production data, regenerate Prisma, and run applicable verification.
5. Commit schema, new migration, implementation, tests, and synchronized documentation together.
6. Apply committed migrations to a known target with `prisma migrate deploy`; do not generate migrations in deployment.
7. Verify migration state and affected application flows; prefer a roll-forward correction because database rollback is not established.

Never edit a migration already applied to a shared target, reset a hosted database, or run local seed/admin scripts before their database-name guard succeeds. The repository provides local guards but contains no proof of production backup, point-in-time recovery, migration automation in Vercel, or restore testing.
