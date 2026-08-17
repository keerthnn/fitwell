---
id: architecture-application-boundaries
title: Application Boundaries
status: active
authority: engineering
requirements: [SEC-004]
decisions: []
code: [src/pages/, src/components/, src/lib/, src/utils/, src/generated/, scripts/]
tests: [test cases/]
last_verified: 2026-08-15
---

# Application boundaries

## Source responsibilities

| Location | Current responsibility |
| --- | --- |
| `src/pages/` | File-based UI routes and page-level data orchestration |
| `src/pages/api/` | Same-origin server endpoints and persistence orchestration |
| `src/components/` | Shared UI, domain components, shells, guards, and providers |
| `src/utils/spec.ts` | Shared browser Axios wrappers |
| `src/utils/types.ts` | Browser-facing domain and API types |
| `src/lib/api/validators/` | Pure runtime parsing and validation |
| `src/lib/auth/` | Server token verification and admin authorization |
| `src/lib/` | Prisma, Firebase, analytics, images, audit, and access helpers |
| `src/generated/prisma/` | Generated Prisma client; not hand-authored |
| `src/theme.ts` | MUI theme and FitWell design tokens |
| `prisma/` | Exact schema and migration history |
| `scripts/` | Local database, seed, admin, and asset operations |
| `test cases/` | Configured test root mirroring `src/`; currently empty |

## Dependency direction

- UI pages/components call same-origin APIs through functions in `src/utils/spec.ts`.
- Browser code shares types but does not import Prisma or Firebase Admin.
- API handlers import method helpers, validators, auth helpers, and the shared Prisma client through `fitness/*`.
- Domain-specific server helpers include workout-plan visibility and analytics time/activity utilities.
- Prisma-generated types are imported by server/database helpers; browser contracts remain handwritten shared types.

## Cross-cutting providers

`_app.tsx` composes `ThemeModeProvider -> AuthContextProvider -> RestTimerProvider`. Provider order lets the rest timer scope browser state to the resolved Firebase user and lets all shells consume theme state.

## Boundary exceptions

`src/lib/authUtils.ts` is the client Firebase action helper, while `src/lib/auth/utils.ts` is server authentication. `src/pages/api/auth/sync-user.ts` re-exports the implementation in `create-user.ts`.

## Placement contracts

The repository guide requires feature pages in `src/pages/`, API handlers in `src/pages/api/`, reusable UI in `src/components/`, shared browser requests/types in `src/utils/spec.ts` and `src/utils/types.ts`, and tests under `test cases/`.
