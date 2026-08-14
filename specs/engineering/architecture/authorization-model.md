---
id: architecture-authorization-model
title: Authorization Model Standard
status: draft
authority: binding-engineering
requirements: []
decisions: []
code: []
tests: []
last_verified: null
---

# Authorization model

## Purpose

This document is the mandatory engineering contract for resource access. It defines how FitWell converts an authenticated principal into permitted actions while preserving user isolation and administrator boundaries.

## Required content

An active revision must define:

- Principals, roles, and trust sources.
- User-owned, platform-owned, shared, and public resource classes.
- Read, create, update, delete, archive, restore, and administrative permissions.
- Ownership inheritance across related records.
- Administrator grant, removal, and loss-of-access behavior.
- Effects of disabled, deleted, or partially provisioned accounts.
- Error-disclosure policy for forbidden versus missing resources.
- Audit requirements for privileged actions.

## Binding rules

- Authenticate and authorize on the server for every protected operation.
- Never accept user ID, role, or ownership from the client as authority.
- Verify ownership for both reads and mutations.
- A null owner is not public authorization unless the resource class explicitly defines it.
- Client-side routing and hidden controls never replace API authorization.
- Use least privilege; administrator access does not imply unrestricted data access without a documented requirement.
- Test signed-out, cross-user, normal-user-on-admin, revoked-admin, and stale-reference cases as applicable.

## Change control

Any permission, ownership, public/private boundary, or admin-role change requires Full SDD, linked security requirements, and adversarial verification.
