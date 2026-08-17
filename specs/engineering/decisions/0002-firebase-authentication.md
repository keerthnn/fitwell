---
id: ADR-0002
title: Use Firebase Authentication with server-verified ID tokens
status: accepted
authority: decision
date: 2026-08-15
requirements: [AUTH-001, AUTH-002, AUTH-003, AUTH-004, SEC-001]
supersedes: []
superseded_by: null
---

# ADR-0002: Use Firebase Authentication with server-verified ID tokens

## Context and decision

Browser sign-in and session observation use Firebase client SDK. The current ID token is copied to a `token` cookie, and API handlers verify it with Firebase Admin before local access. Email/password and Google sign-in are implemented. Evidence is in `firebaseConfig.ts`, `firebaseAdmin.ts`, `AuthContext.tsx`, and auth helpers.

## Drivers and alternatives

The implementation needs an external identity source and server-verifiable API requests. No historic comparison with Auth.js, custom credentials, or other providers is preserved; their rejection rationale is unknown.

## Consequences

FitWell depends on Firebase configuration and service credentials. Token refresh follows Firebase client state. The JavaScript-written cookie is not HttpOnly, and local disabled/deleted state is checked separately.

## Security and data impact

Only Admin SDK verification establishes API identity. Public web configuration may reach the browser; Admin credentials stay server-only. Repository account deletion does not prove Firebase identity deletion.

## Related documents and outcome

[Authentication PRD](../../prds/domains/authentication.md), [Authentication flow](../architecture/authentication-flow.md), [Firebase integration](../integrations/firebase.md). Accepted current decision; review if identity provider, token transport, or session model changes.
