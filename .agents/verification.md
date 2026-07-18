# Verification

## Required checks

Run the relevant checks after changes:

```bash
pnpm run lint
pnpm run build
```

Run `pnpm run dev` for targeted manual verification of the changed page or API flow. For authenticated functionality, test the appropriate signed-out, signed-in, and admin states.

## Manual checks by change type

- **Frontend:** verify loading, empty, error, and success states; check navigation and responsive MUI layout.
- **User API:** confirm a user can access only their own records and a signed-out request is rejected.
- **Admin API:** confirm a normal user is rejected and an admin can complete the operation.
- **Schema changes:** apply the migration in the target environment, verify affected reads/writes, and confirm generated Prisma types compile.

## Current lint baseline

At the time this guide was added, `pnpm run lint` succeeds with four existing `react-hooks/exhaustive-deps` warnings:

- `src/components/ExerciseSelector.tsx`
- `src/components/context.tsx`
- `src/pages/workouts/[id]/edit.tsx`
- `src/pages/workouts/[id]/index.tsx`

Do not introduce new warnings. If touching one of these files, resolve its warning when the change permits; otherwise call out that the warning is pre-existing.
