# Verification

## Required checks

Run the relevant checks after changes:

```bash
pnpm run lint
pnpm run test
pnpm run typecheck
pnpm run build
pnpm run verify:assets
```

Run `pnpm run dev` for targeted manual verification of the changed page or API flow. For authenticated functionality, test the appropriate signed-out, signed-in, and admin states.

## Manual checks by change type

- **Frontend:** verify loading, empty, error, and success states; check navigation and responsive MUI layout.
- **User API:** confirm a user can access only their own records and a signed-out request is rejected.
- **Admin API:** confirm a normal user is rejected and an admin can complete the operation.
- **Schema changes:** apply the migration in the target environment, verify affected reads/writes, and confirm generated Prisma types compile.

Also search the working tree for removed product terminology, RPE fields, Zod imports, unsupported routes, and files over 300 lines. Generated Prisma output, lockfiles, migrations, and catalogue data are documented exceptions.
