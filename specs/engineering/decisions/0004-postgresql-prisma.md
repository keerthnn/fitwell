---
id: ADR-0004
title: Use PostgreSQL through Prisma and one shared client
status: accepted
authority: decision
date: 2026-08-15
requirements: [DATA-001, DATA-003, DATA-006]
supersedes: []
superseded_by: null
---

# ADR-0004: Use PostgreSQL through Prisma and one shared client

## Context and decision

FitWell persists relational application data in PostgreSQL. Prisma 7 defines schema, generated client, and committed migrations. `src/lib/prisma.ts` creates the client through `@prisma/adapter-pg` and reuses a global instance outside production.

## Drivers and alternatives

The domains require relations, transactions, constraints, and typed access. No historic database/ORM evaluation is committed; direct SQL, another ORM, and non-relational storage are not implemented and no rejection rationale is reconstructed.

## Consequences

Schema history and typed access are centralized. Runtime and migration operation depend on `DATABASE_URL`, generated code, Prisma compatibility, and PostgreSQL. Handlers import the shared client rather than instantiate another.

## Security and data impact

The connection URL is server-only. Ownership remains an application predicate; ORM typing is not authorization. Migration and recovery remain operational responsibilities.

## Related documents and outcome

[Database design](../database/database-design.md), [Migration policy](../database/migration-policy.md), [PostgreSQL integration](../integrations/postgresql-hosting.md). Accepted current decision; review on persistence engine, ORM, or connection change.
