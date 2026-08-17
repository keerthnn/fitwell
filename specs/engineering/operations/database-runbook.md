---
id: operations-database-runbook
title: Database Runbook
status: active
authority: operational
last_verified: 2026-08-15
---

# Database runbook

## Local setup and catalogue data

1. Set `DATABASE_URL` to local PostgreSQL database `fitness`.
2. Run `pnpm run db:assert-local`; stop unless its host and database checks pass.
3. The repository setup guide uses `pnpm prisma migrate reset --force` only for that confirmed local database.
4. Run `pnpm run db:seed-all` to upsert exercise and built-in plan catalogues. Individual seed commands are available.
5. `pnpm run db:grant-local-admin -- <firebase-uid>` grants local admin access through a guarded script; use only a verified local UID/target.

## Shared/hosted target

Apply only committed migrations using `pnpm run db:migrate:deploy`. Never reset a hosted database, edit applied migrations, or assume seed commands are safe for an unresolved target. Review migration SQL and verify schema/application behavior afterward. Provider backup/restore, hosted migration status, integrity queries, and monitoring are not defined in repository evidence.
