# FitWell Version 1

FitWell is a workout tracker built with Next.js Pages Router, React, MUI, Firebase Authentication, PostgreSQL, and Prisma.

The authoritative current-state product and engineering documentation is under [specs](specs/README.md). The older files under `docs/` are retained as historical bootstrap evidence and are not authoritative when they conflict with `specs/` or current source.

## Local setup

1. Configure Firebase client and admin credentials in `.env`.
2. Set `DATABASE_URL` to the local PostgreSQL database `fitness`.
3. Install dependencies with `pnpm install`.
4. Verify the database target with `pnpm run db:assert-local`.
5. Apply the clean schema with `pnpm prisma migrate reset --force`.
6. Seed with `pnpm run db:seed-all`.
7. Start the app with `pnpm run dev`.

The database safety check rejects production mode, remote hosts, cloud-provider hostnames, and any database name other than `fitness`. Prisma resets affect PostgreSQL only. They never delete or modify Firebase Authentication identities.

## Vercel deployment

1. Provision a PostgreSQL database and apply the committed migrations with `pnpm run db:migrate:deploy`.
2. Seed a new database with `pnpm run db:seed-all` if it needs the built-in exercise and Workout Plan catalogues.
3. Import the repository into Vercel as a Next.js project. Vercel can use the default install and build settings.
4. Add every variable from `.env.example` to the Vercel Production environment. Use a pooled PostgreSQL connection URL for `DATABASE_URL`.
5. Deploy, then add the generated `*.vercel.app` hostname to Firebase Authentication's authorized domains.

The install lifecycle runs `prisma generate`, so the ignored generated Prisma client is recreated during each clean Vercel build. Never run `prisma migrate reset` or the local database reset workflow against a hosted database.

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
