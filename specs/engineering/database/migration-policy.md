---
id: database-migration-policy
title: Database Migration Policy
status: draft
authority: operational
requirements: []
decisions: []
code:
  - prisma/migrations/
tests: []
last_verified: null
---

# Database migration policy

## Purpose

This policy governs safe, reviewable, and repeatable PostgreSQL schema evolution through committed Prisma migrations.

## Required workflow

1. Classify additive, compatibility-sensitive, destructive, or data-transforming impact.
2. Use Full SDD for destructive, relationship, ownership, retention, or substantial backfill changes.
3. Design expand/migrate/contract phases when old and new application versions may overlap.
4. Generate the migration against an explicitly validated local target.
5. Review SQL, locks, defaults, constraints, index creation, and data effects.
6. Test on representative data and verify generated Prisma types.
7. Define hosted deployment, validation, and roll-forward/recovery steps.
8. Commit schema, migration, code, tests, and documentation together.

## Rules

- Never edit a migration already applied to a shared or hosted environment.
- Never reset or destructively migrate an unresolved target.
- Prefer additive changes followed by backfill and later constraint/removal.
- Large backfills state batching, restartability, runtime, and partial-failure handling.
- Required columns on existing data need a safe population strategy.
- Destructive changes require explicit project-owner approval and verified recovery.
- Application rollback is not a database rollback plan; prefer roll-forward unless a tested reversible path exists.

## Evidence

Record migration status, integrity queries, affected-row expectations, application compatibility, and post-deployment checks in Full SDD Verification and the database runbook.
