---
id: operations-database-runbook
title: Database Runbook Standard
status: draft
authority: operational
last_verified: null
---

# Database runbook

## Purpose

This document defines safe operational procedures for database setup, migration, seeding, inspection, administrative grants, and integrity verification.

## Required procedure sections

- Local target validation and setup.
- Migration generation and SQL review.
- Applying migrations to local, preview, and production targets.
- Seed scope, idempotency, and target restrictions.
- Administrative access procedure and audit evidence.
- Schema/migration status inspection.
- Connection and health diagnosis.
- Integrity queries after migration or recovery.
- Stop conditions and project-owner escalation.

## Binding safety rules

- Resolve and display the exact target before destructive or migration commands.
- Never use broad environment-variable assumptions as the only target guard.
- Never reset a hosted database.
- Never edit migration history already applied to a shared target.
- Seed only data classes explicitly designed for repeatable seeding.
- Preserve command output needed for Full SDD Verification without retaining secrets.

## Review

Migration tooling, provider, connection strategy, seed model, or admin-access changes require this runbook to be updated and reverified.
