---
id: integration-firebase
title: Firebase Integration
status: active
authority: engineering
requirements: [AUTH-001, AUTH-002, AUTH-003, AUTH-004, AUTH-005, SEC-001, SEC-005]
decisions: [ADR-0002, ADR-0003]
code: [src/lib/firebaseConfig.ts, src/lib/firebaseAdmin.ts, src/components/context.tsx, .env.example, README.md]
tests: []
last_verified: 2026-08-15
---

# Firebase integration

## Repository-visible contract

Firebase Authentication is FitWell's identity provider. The browser initializes a Firebase app from six `NEXT_PUBLIC_FIREBASE_*` variables, uses local persistence, supports email/password and Google popup sign-in, observes token changes, and writes the ID token to the `token` cookie. Server code initializes Firebase Admin from project ID, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY`, then verifies the cookie token.

Firebase UID becomes `User.id`; email, display name, and photo URL synchronize to PostgreSQL. Local disabled/deleted state and `AdminAccess` are application concerns, not Firebase claims. Account deletion preserves the Firebase identity according to repository documentation and code behavior.

## Configuration and failure behavior

Public variable names are browser-visible and contain no Admin secret. The client initializes only when the public API key exists; missing configuration leaves authentication unavailable. Server credentials are required for token verification and newline escapes in the private key are converted at runtime. Secrets must exist only in environment stores.

## External state not proven

The repository does not identify Firebase project IDs, enabled providers in Console, authorized domains, quota, audit/log retention, credential rotation, or environment-to-project mapping. `README.md` instructs adding the Vercel hostname as an authorized domain after deployment, but does not prove it is configured.
