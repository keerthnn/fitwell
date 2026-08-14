---
id: database-data-lifecycle
title: Data Lifecycle Standard
status: draft
authority: binding-engineering
requirements: []
decisions: []
code:
  - prisma/schema.prisma
tests: []
last_verified: null
---

# Data lifecycle

## Purpose

This document governs how persistent data is created, updated, retained, disabled, archived, deleted, anonymized, restored, and audited.

## Required lifecycle record

For each data class—identity/profile, exercise catalog, workouts/sets, plans, analytics/activity, feedback, and administration/audit—an active revision must define:

- Creator and owner.
- Creation and update triggers.
- Authoritative source.
- Active, archived, disabled, deleted, or terminal states.
- Retention duration or explicit indefinite-retention rationale.
- User deletion and administrator action effects.
- Cascade, restrict, set-null, tombstone, or anonymization behavior.
- Backup/restore expectation.
- Downstream derived-data effects.
- Tests and operational evidence.

## Rules

- Distinguish identity-provider deletion from application-data deletion.
- Do not promise recoverability without a verified backup/restore mechanism.
- Destructive operations require explicit confirmation, authorization, and failure handling.
- Audit data must balance accountability with sensitive-data minimization.
- Historical fitness records must not silently change meaning after catalogue or plan edits.

## Change control

Retention, deletion, tombstone, ownership, cascade, or recovery changes require Full SDD and system-quality review.
