---
id: ADR-0003
title: Use Firebase UID as the application User identifier
status: accepted
authority: decision
date: 2026-08-15
requirements: [AUTH-005, SEC-002, DATA-001]
supersedes: []
superseded_by: null
---

# ADR-0003: Use Firebase UID as the application User identifier

## Context and decision

`User.id` has no database default; authentication synchronization upserts it from the verified token UID, and owned models reference it. FitWell uses Firebase UID directly as the local primary and principal identifier.

## Drivers and alternatives

Authenticated ownership requires one consistent mapping to PostgreSQL. The original comparison is not preserved; a separate generated user ID and identity-mapping table is not implemented.

## Consequences

Authorization queries can use verified UID directly. The application is coupled to Firebase identifier continuity, and local tombstones reject a returning deleted principal.

## Security and data impact

UID must come only from verified tokens, never request input. User-owned queries constrain by this ID or an ownership relation.

## Related documents and outcome

[Authorization model](../architecture/authorization-model.md), [Database design](../database/database-design.md), [Authentication SDD](../features/authentication.md). Accepted current decision; review before identity migration or account linking.
