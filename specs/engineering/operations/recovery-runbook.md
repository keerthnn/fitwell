---
id: operations-recovery-runbook
title: Recovery Runbook and Known Limitations
status: draft
authority: operational
last_verified: 2026-08-15
---

# Recovery runbook and known limitations

The repository contains no tested application rollback, database restore, point-in-time recovery, Firebase recovery, or automated incident procedure. Therefore no destructive recovery step is currently authorized by documentation.

For an incident: stop harmful writes/deployments when safe, identify the exact environment and failing boundary, preserve non-secret logs and deployment/migration identifiers, and use only provider capabilities confirmed by the project owner. Validate authentication, authorization, database integrity, and critical flows after containment. Prefer a reviewed roll-forward for application/migration defects because database rollback is unproven.

This document cannot become active until provider backup/retention is verified, a restore target and authority are named, application rollback is proven, and scenario-specific checks are exercised. A provider claim that backups exist is not restore evidence.
