---
id: operations-recovery-runbook
title: Recovery Runbook Standard
status: draft
authority: operational
last_verified: null
---

# Recovery runbook

## Purpose

This document governs incident stabilization and recovery for failed deployment, migration, authentication, database, configuration, and data-integrity events.

## Incident sequence

1. Detect and record symptoms, time, environment, and affected capabilities.
2. Stop harmful writes or deployments when continued operation increases risk.
3. Preserve logs and evidence without sensitive data.
4. Identify the failure domain: application, identity provider, hosting, database, or configuration.
5. Choose only a verified containment or recovery procedure.
6. Validate data integrity, authorization, authentication, and critical flows after recovery.
7. Document residual impact and follow-up changes.

## Scenario requirements

An active revision must provide scenario-specific steps for failed deployment, failed migration, identity outage, database unavailability, wrong configuration, and catalogue/user-data corruption. Each scenario defines authority, stop conditions, recovery prerequisites, and proof of success.

## Rules

- Do not improvise destructive recovery under uncertainty.
- Prefer roll-forward when database rollback is untested.
- A provider backup is not a recovery plan until restore is tested.
- Security incidents prioritize containment and user-data protection over availability.

## Maintenance

Exercise or tabletop critical recovery paths periodically and update `last_verified` with evidence.
