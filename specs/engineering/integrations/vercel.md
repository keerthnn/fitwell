---
id: integration-vercel
title: Vercel Integration
status: active
authority: engineering
requirements: [SEC-005, DATA-003]
decisions: [ADR-0001]
code: [README.md, package.json, next.config.ts, .env.example]
tests: []
last_verified: 2026-08-15
---

# Vercel integration

## Repository-visible contract

The repository documents Vercel as the deployment target for the single Next.js application. `package.json` pins Node `22.x`, uses pnpm, generates Prisma during `postinstall`, and builds with `next build --webpack`. `README.md` says the repository may be imported as a Next.js project with default install/build settings, environment variables copied from `.env.example`, and a pooled PostgreSQL URL used for `DATABASE_URL`.

Committed migrations must be applied separately with `pnpm run db:migrate:deploy`; no Vercel build hook applies them. New databases may receive the explicit catalogue seeds. After deployment the generated Vercel hostname must be authorized in Firebase.

## External state not proven

There is no `vercel.json` and no repository evidence for a Vercel project identifier, Git/branch linkage, preview configuration, variable values/scopes, regions, function duration, deployment protection, custom domains, observability, or rollback settings. No live Vercel dashboard was inspected. Those facts remain unknown.
