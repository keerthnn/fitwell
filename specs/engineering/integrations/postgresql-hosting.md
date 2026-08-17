---
id: integration-postgresql-hosting
title: PostgreSQL Hosting Integration
status: active
authority: engineering
requirements: [DATA-001, DATA-003, DATA-006, SEC-005]
decisions: [ADR-0004]
code: [.env.example, prisma.config.ts, src/lib/prisma.ts, README.md, scripts/assert-local-database.mjs]
tests: []
last_verified: 2026-08-15
---

# PostgreSQL hosting integration

## Repository-visible contract

PostgreSQL is configured only through server-side `DATABASE_URL`. Prisma configuration uses it for migrations and `src/lib/prisma.ts` supplies it to the `pg` adapter. Seed scripts also connect with `pg`. The repository recommends a pooled connection URL on Vercel and a local database named `fitness` for local work.

`scripts/assert-local-database.mjs` rejects production mode, non-local hosts, recognized cloud-provider hostnames, and database names other than `fitness` before local destructive/setup workflows. This protects the documented local process; it is not proof of hosted isolation.

## External state not proven

No provider, host, region, PostgreSQL version, TLS policy, pool size, connection/transaction limits, storage capacity, monitoring, backups, point-in-time recovery, maintenance window, or tested restore exists in repository evidence. No live database was inspected, so deployed migration state and data health are unknown. Connection strings and credentials must never enter documentation.
