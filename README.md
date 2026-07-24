# FitWell Version 1

FitWell is a local-development-only workout tracker built with Next.js Pages Router, React, MUI, Firebase Authentication, PostgreSQL, and Prisma.

## Local setup

1. Configure Firebase client and admin credentials in `.env`.
2. Set `DATABASE_URL` to the local PostgreSQL database `fitness`.
3. Install dependencies with `pnpm install`.
4. Verify the database target with `pnpm run db:assert-local`.
5. Apply the clean schema with `pnpm prisma migrate reset --force`.
6. Seed with `pnpm run db:seed-all`.
7. Start the app with `pnpm run dev`.

The database safety check rejects production mode, remote hosts, cloud-provider hostnames, and any database name other than `fitness`. Prisma resets affect PostgreSQL only. They never delete or modify Firebase Authentication identities.

## Verification

```bash
pnpm run test
pnpm run lint
pnpm run typecheck
pnpm run build
pnpm run verify:assets
```

## Product scope

Version 1 includes authentication, onboarding, profiles, settings, an exercise catalogue, live and quick-entry workouts, private and built-in Workout Plans, workout analytics, and system administration.

Nutrition, calories, medical and injury records, weight history, achievements, sharing, community discovery, and public plans are intentionally outside Version 1.

Account deletion removes local application data and retains a disabled PostgreSQL tombstone keyed by Firebase UID. The Firebase Authentication identity is preserved.
