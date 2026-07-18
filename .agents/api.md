# API conventions

API routes use Next.js Pages Router handlers with `NextApiRequest` and `NextApiResponse`. Each file in `src/pages/api/` serves the corresponding `/api/...` URL.

## Route recipe

1. Place the handler under the appropriate domain directory (`workouts`, `user`, `exercises`, `admin`, or a new feature domain).
2. Import and run the appropriate method guard from `fitness/lib/api/api-utils` at the start of the handler:
   - `checkIfGetOrSetError`
   - `checkIfPostOrSetError`
   - `checkIfDeleteOrSetError`
3. For user-scoped operations, call `getUserIdOrSetError(req, res)` and return immediately when it has no result.
4. For admin operations, call `requireAdmin(req, res)` and return immediately when it has no result.
5. Validate required request data before querying. Return `400` for invalid or incomplete input.
6. Use the shared Prisma client from `fitness/lib/prisma` and scope user-owned queries/mutations to the verified user ID.
7. Return JSON responses matching the client type. Use `404` when the requested resource does not exist, `401` for a missing/invalid login, `403` for insufficient privileges, and the method helper's `405` for unsupported methods.

## Example shape

```ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!checkIfPostOrSetError(req, res)) return;

  const userId = await getUserIdOrSetError(req, res);
  if (!userId) return;

  const { requiredField } = req.body;
  if (!requiredField) return res.status(400).json({ error: "requiredField is required" });

  // Query through the shared Prisma client and include userId in ownership checks.
  return res.status(200).json({ success: true });
}
```

## Client contract

If a browser page uses the route, add a corresponding Axios wrapper in `src/utils/spec.ts` and shared request/response types in `src/utils/types.ts`. Do not duplicate raw Axios calls across page components.

Do not trust IDs received from the client alone: load the target record and confirm it belongs to the authenticated user before reading, updating, or deleting it.
