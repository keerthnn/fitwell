---
id: operations-environments
title: Environment Standard
status: draft
authority: operational
last_verified: null
---

# Environments

## Purpose

This document governs separation and allowed use of local, preview, and production environments.

## Required environment record

For each environment define purpose, users, deployment source, identity project, database, configuration source, data policy, external integrations, logging, and allowed destructive operations.

## Binding safety rules

- Production data and identity must not be used implicitly by local or preview execution.
- Destructive commands require an explicitly resolved and validated target.
- Test credentials and seed data must not create production access.
- Preview environment behavior and persistence expectations must be documented.
- Environment detection must not depend on an easily ambiguous convention alone for destructive safety.
- Logs and diagnostics follow the same sensitive-data rules in every environment.

## Promotion and drift

Document how changes move from local to preview to production and which differences are intentional. Dashboard-only differences are integration facts and require verification. Environment parity is a goal only where it does not weaken isolation.

## Review

Reverify after identity, database, domain, hosting, or configuration changes and before production data operations.
