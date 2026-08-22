---
id: sdd-authentication
title: Authentication
status: active
authority: engineering
requirements: [AUTH-001, AUTH-002, AUTH-003, AUTH-004, AUTH-005, AUTH-006, AUTH-007, AUTH-008, AUTH-009, AUTH-010, AUTH-011, SEC-001, SEC-005]
decisions: [ADR-0001, ADR-0002, ADR-0003, ADR-0004, ADR-0005]
code: [src/pages/auth/, src/lib/firebaseConfig.ts, src/lib/firebaseAdmin.ts, src/lib/authUtils.ts, src/lib/auth/, src/components/context.tsx, src/components/AuthenticatedPage.tsx, src/pages/api/auth/]
tests: []
last_verified: 2026-08-15
---

# Authentication SDD

## Scope and goals

Authentication covers email/password sign-up and sign-in, Google popup sign-in, password reset, Firebase session observation, ID-token cookie transport, local `User` synchronization, protected-page routing, disabled/deleted local account rejection, and sign-out. It does not implement MFA, email verification gates, session management UI, or Firebase identity deletion.

## User flows

### Sign up/sign in

The auth pages call helpers in `src/lib/authUtils.ts`. Email/password uses Firebase email APIs; Google uses a popup provider that prompts account selection. Firebase emits the resulting user through `onIdTokenChanged`.

### Session establishment

`AuthContextProvider` gets the ID token, writes `idToken`, calls `createUser()` against `/api/auth/sync-user`, then resolves loading. Sync failure removes the cookie and local user. Authenticated visitors on public/auth routes query profile status and route to onboarding or dashboard.

### Password reset/sign-out

Forgot-password calls Firebase's reset-email action. Sign-out calls Firebase sign-out; the auth observer removes the cookie. Member settings exposes sign-out.

## Component responsibilities

- Auth pages own form input, Firebase error display, pending state, and links.
- `AuthContextProvider` owns session observation, cookie lifecycle, local-user synchronization, and public-route redirect.
- `AuthenticatedPage` supplies a client routing guard and loading state.
- `AdminPageGuard` performs the additional admin-status check.

## API and database usage

`POST /api/auth/sync-user` verifies the Firebase token, requires an email, rejects disabled/deleted local users, and upserts `User` by token UID. It updates email/name/photo/last activity and records a daily activity row. No password or provider token is stored in PostgreSQL.

## Failure handling and security

Missing/invalid/expired cookies return 401. Disabled/deleted local accounts return 403. Provider/configuration errors remain client-visible. The cookie is JavaScript-written and therefore not HttpOnly. Server APIs never trust the Firebase client object; Firebase Admin re-verifies the token.

## Edge cases and gaps

- Firebase account without email is rejected.
- Local sync failure leaves the Firebase session possible but FitWell clears its local user/cookie state.
- The return-target query is produced by the member guard; auth-page consumption requires manual flow verification.
- Authorized domains, provider enablement, and cookie behavior need live verification.
- No automated auth tests exist.

## Code map

| Responsibility | Code |
| --- | --- |
| Auth pages | `src/pages/auth/sign-in.tsx`, `sign-up.tsx`, `forgot-password.tsx` |
| Client Firebase actions/config | `src/lib/authUtils.ts`, `src/lib/firebaseConfig.ts` |
| Session context | `src/components/context.tsx` |
| Page guards | `src/components/AuthenticatedPage.tsx`, `AdminPageGuard.tsx` |
| Server verification | `src/lib/auth/utils.ts`, `src/lib/firebaseAdmin.ts` |
| Local user sync | `src/pages/api/auth/create-user.ts`, `sync-user.ts` |

## Related documents

[Authentication PRD](../../prds/domains/authentication.md), [Authentication Flow](../architecture/authentication-flow.md), and [Authorization Model](../architecture/authorization-model.md).
