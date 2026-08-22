---
id: architecture-authentication-flow
title: Authentication Flow
status: active
authority: engineering
requirements: [AUTH-001, AUTH-002, AUTH-003, AUTH-004, AUTH-006, AUTH-007, AUTH-008, AUTH-009, AUTH-010, SEC-001, SEC-005]
decisions: []
code: [src/lib/firebaseConfig.ts, src/lib/firebaseAdmin.ts, src/lib/authUtils.ts, src/lib/auth/utils.ts, src/components/context.tsx, src/components/AuthenticatedPage.tsx, src/pages/api/auth/create-user.ts, src/pages/api/auth/sync-user.ts]
tests: []
last_verified: 2026-08-15
---

# Authentication flow

## Client initialization

`firebaseConfig.ts` initializes the Firebase web app only when the public API key exists. It creates Firebase Auth, requests browser-local persistence, and creates a Google provider configured to prompt for account selection.

## Sign-in actions

`src/lib/authUtils.ts` wraps email/password sign-in, Google popup sign-in, email/password sign-up, password reset, sign-out, and auth observers. Google/sign-up flows reject a user without an email.

## Token-to-cookie flow

`AuthContextProvider` subscribes to `onIdTokenChanged`. When signed out it deletes `idToken` and clears the user. When signed in it stores the Firebase user, gets the current ID token, writes it to the cookie, and calls `POST /api/auth/sync-user`. If local synchronization fails, it deletes the cookie and clears local authenticated state.

The cookie is written by browser JavaScript with default `cookies-next` options; the repository does not make it HttpOnly.

## Local user synchronization

`sync-user.ts` re-exports `create-user.ts`. The handler verifies the cookie through Firebase Admin and creates or updates a local `User` keyed by the Firebase UID. Deleted or disabled local accounts are rejected instead of recreated.

## Server verification

`getUserIdOrSetError` reads `idToken`, verifies it through Firebase Admin, rejects missing/invalid/expired tokens, loads disabled/deleted state, records best-effort daily activity, and returns the UID.

## Routing

Authenticated visitors on public/auth pages request profile status and route to dashboard or onboarding. `AuthenticatedPage` redirects signed-out member access to sign-in with a `next` query containing the requested path. Admin guard redirects unauthenticated visitors to sign-in and non-admin members to the dashboard.

## Verification gaps

Firebase configuration, provider availability, browser cookie policy, and authorized domains require live verification. No automated authentication integration tests exist.
