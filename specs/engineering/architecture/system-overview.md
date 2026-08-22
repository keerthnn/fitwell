---
id: architecture-system-overview
title: System Overview
status: active
authority: engineering
requirements: [SEC-001, SEC-002, SEC-003, DATA-001]
decisions: []
code: [src/pages/, src/components/, src/lib/, src/utils/, prisma/schema.prisma]
tests: []
last_verified: 2026-08-15
---

# System overview

## System context

FitWell is a full-stack Next.js Pages Router monolith. The browser renders React/MUI pages and sends same-origin requests to Next.js API Routes. Firebase Authentication supplies external identity; Firebase Admin verifies the browser's ID token on the server. PostgreSQL stores application users and fitness data through Prisma.

~~~text
Browser
  |-- React/MUI Pages Router UI
  |-- Firebase Authentication client
  |-- idToken cookie
  v
Next.js API Routes
  |-- method/auth/validation/authorization
  |-- shared Prisma client
  v
PostgreSQL

Firebase Admin verifies identity tokens.
Vercel is the documented deployment target; repository evidence does not prove a live project.
~~~

## Runtime topology

- Node.js 22 is the declared runtime.
- Next.js 16 and React 19 provide the UI and API runtime.
- Pages under `src/pages/` define public, member, onboarding, and administrator screens.
- Handlers under `src/pages/api/` form the server API.
- The shared Prisma client uses the PostgreSQL adapter and `DATABASE_URL`.
- Firebase client configuration uses public environment variables; Firebase Admin uses server-only service-account fields.
- Local PNG/WebP assets are served from `public/`; asset and seed scripts are run with Node.

## Application partitions

| Partition | Routes | Shell/guard |
| --- | --- | --- |
| Public | `/`, `/auth/*` | `PublicShell` |
| Onboarding | `/onboarding` | Standalone page with authentication behavior |
| Member | All non-public, non-admin pages | `AppShell` plus page-level `AuthenticatedPage` use |
| Administrator | `/system-admin/*` | `AdminLayout` and `AdminPageGuard` |

## Major domains

Authentication; profiles/onboarding; exercise catalog; workouts and rest timer; workout plans; dashboard; analytics; feedback; and administration.

## Persistence domains

The database persists users/profiles, exercises, workout aggregates, plan aggregates, daily activity, administrator membership/audit logs, and feedback conversations. Firebase Authentication identity is external and is not deleted by local account deletion.

## Operational boundaries

The repository includes local database target checks, Prisma migrations, catalogue/plan seeds, local admin grant, asset generation, and asset verification. Vercel/PostgreSQL/Firebase hosted state is not discoverable from Git and remains unverified.
