# Authentication and authorization

## Sign-in flow

Firebase client authentication is configured in `src/lib/firebaseConfig.ts`. The `AuthContextProvider` in `src/components/context.tsx` observes token changes with Firebase's `onIdTokenChanged`.

When a user is signed in, the provider obtains their Firebase ID token and writes it to the `idToken` cookie. When signed out, it removes that cookie. The provider also exposes `user` and `loading` through `useAuth()` and sends a signed-in visitor from `/` to profile setup or the dashboard based on profile status.

The provider calls `/api/auth/sync-user` so PostgreSQL has a matching `User` record. Deleted application accounts remain disabled tombstones and cannot be silently recreated.

## API authentication

API handlers must authenticate user-scoped requests with:

```ts
const userId = await getUserIdOrSetError(req, res);
if (!userId) return;
```

This helper reads the `idToken` cookie and verifies it through Firebase Admin (`src/lib/firebaseAdmin.ts`). It sends an error response when no valid token is available. Use the resulting Firebase UID as the database user ID and include it in every ownership filter or check.

## Admin authorization

Admin routes must call:

```ts
const adminId = await requireAdmin(req, res);
if (!adminId) return;
```

`requireAdmin` first verifies the user, then checks for a matching `AdminAccess` record. It returns `403` when the authenticated user is not an admin. Client-side route visibility is not sufficient authorization; the API check is required.

## Safety rules

- Never accept a user ID from the request body or query as the authority for user-owned data.
- Never expose Firebase service-account values, database URLs, ID tokens, or cookies in source, logs, or docs.
- New authenticated routes should be tested signed out, as a normal user, and as an admin when applicable.
- Never call Firebase Admin user deletion. Application account deletion preserves Firebase Authentication identities.
