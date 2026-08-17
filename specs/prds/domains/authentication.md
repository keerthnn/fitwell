---
id: prd-authentication
title: Authentication
status: active
authority: binding-product
requirement_prefix: AUTH
engineering:
  - specs/engineering/features/authentication.md
  - specs/engineering/architecture/authentication-flow.md
last_verified: 2026-08-15
---

# Authentication PRD

## Purpose

Authentication lets a visitor establish a FitWell session and lets the application distinguish public, member, onboarding, and administrator experiences.

## Requirements

### AUTH-001 — Email registration

A visitor may create an account with an email address and password.

### AUTH-002 — Email sign-in

A returning visitor may sign in with an email address and password.

### AUTH-003 — Google sign-in

A visitor may sign in with a Google account that supplies an email address.

### AUTH-004 — Password recovery

A visitor may request a password-reset email.

### AUTH-005 — Authentication configuration failure

When authentication is not configured in the browser, authentication actions must fail with a user-facing configuration error rather than behaving as successful.

### AUTH-006 — Local application session

After the external identity is accepted, FitWell must establish the local application user before treating the session as ready.

### AUTH-007 — Post-authentication routing

A signed-in visitor on the landing or authentication pages must be routed to onboarding when profile setup is incomplete and to the dashboard when it is complete.

### AUTH-008 — Protected-page routing

A signed-out visitor who opens a member page must be routed to sign-in. The requested member location is carried as a return target by the member-page guard.

### AUTH-009 — Sign-out

A member may sign out, after which the local authentication state and authentication cookie are removed.

### AUTH-010 — Disabled or deleted local account

If the local application account is disabled or marked deleted, FitWell must reject application access and must not silently recreate the account from the external identity.

### AUTH-011 — External identity preservation

Deleting FitWell application data does not delete the external Firebase Authentication identity.

## Failure and edge outcomes

Authentication-provider errors are displayed on the relevant form. A Google account without an email is rejected. Protected pages show a loading state while identity is unresolved.

## Traceability

Implementation design is defined by the [Authentication SDD](../../engineering/features/authentication.md) and [Authentication Flow](../../engineering/architecture/authentication-flow.md).
