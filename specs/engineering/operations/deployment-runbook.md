---
id: operations-deployment-runbook
title: Vercel Deployment Runbook
status: draft
authority: operational
last_verified: 2026-08-15
---

# Vercel deployment runbook

## Repository-supported procedure

1. Confirm reviewed revision and Node 22/pnpm compatibility; run lint, typecheck, applicable tests, build, and asset verification.
2. Provision the intended PostgreSQL target and apply committed migrations with `pnpm run db:migrate:deploy` outside the Vercel build.
3. For a new empty database only, run the explicit repeatable catalogue seeds if required.
4. Import/deploy the repository as a Next.js project. Clean install runs `prisma generate`; build runs `next build --webpack`.
5. Configure every variable from `.env.example`, with server secrets restricted and a pooled production `DATABASE_URL`.
6. Add the resulting `*.vercel.app` hostname to Firebase Authentication authorized domains.
7. Inspect build/runtime logs and smoke-test sign-in, local-user synchronization, profile routing, an authenticated read, and changed flows.

Stop if the target, migration state, required variables, Firebase project/domain, or build checks are unresolved. Never use `prisma migrate reset` on hosted data. This runbook remains draft because no live Vercel project, rollback mechanism, or executed deployment evidence was inspected.
