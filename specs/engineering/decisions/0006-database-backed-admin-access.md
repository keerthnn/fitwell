---
id: ADR-0006
title: Authorize administrators with database access records
status: accepted
authority: decision
date: 2026-08-15
requirements: [ADMIN-001, ADMIN-003, SEC-001, SEC-004]
supersedes: []
superseded_by: null
---

# ADR-0006: Authorize administrators with database access records

## Context and decision

After Firebase identity and local user state are verified, `requireAdmin` requires an `AdminAccess` row. Grants name an optional grantor; selected privileged actions append `AdminAuditLog`. Removal, disable, and delete flows protect the last active administrator.

## Drivers and alternatives

Privileged authority must be server-side and revocable. No historic evaluation of Firebase custom claims, static allowlists, or granular roles exists; they are not current authority.

## Consequences

Role changes take effect through PostgreSQL independently of client state but depend on database availability. One administrator capability exists; permission groups do not.

## Security and data impact

Every `/api/admin/*` handler calls `requireAdmin`; `AdminPageGuard` alone is insufficient. Grant changes preserve last-admin safety and non-secret audit metadata.

## Related documents and outcome

[Administration PRD](../../prds/domains/administration.md), [Authorization model](../architecture/authorization-model.md), [Administration SDD](../features/administration.md). Accepted current decision; review if authority source or role granularity changes.
