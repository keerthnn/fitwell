---
id: quality-verification-matrix
title: Verification Matrix and Bootstrap Evidence
status: active
authority: binding-process
requirements: []
decisions: []
code: [package.json, vitest.config.ts, scripts/verify-assets.mjs]
tests: []
last_verified: 2026-08-15
---

# Verification matrix and bootstrap evidence

## Repository commands

| Evidence | Command | Current purpose |
| --- | --- | --- |
| Lint | `pnpm run lint` | ESLint checks repository source. |
| Types | `pnpm run typecheck` | Strict TypeScript no-emit check. |
| Automated tests | `pnpm run test` | Runs configured Vitest suite; currently no test files exist. |
| Production build | `pnpm run build` | Generates Prisma during lifecycle and builds Next.js with webpack. |
| Static assets | `pnpm run verify:assets` | Verifies seeded exercise/plan asset references. |

## Required evidence by change

| Change | Minimum repository evidence | Focused evidence |
| --- | --- | --- |
| Documentation only | Link/path and consistency validation | Authority, status, implementation accuracy, traceability. |
| UI or browser data flow | Lint, typecheck, focused component tests, build | Responsive, keyboard/focus, loading/empty/error/success, API failure. |
| API read/mutation | Lint, typecheck, handler tests, build | Method, validation, signed-out, cross-user/admin, state conflict, persistence and transaction. |
| Authentication/administration | Relevant full suite and build | Invalid/expired token, disabled/deleted user, non-admin, revoked/last admin, safe disclosure, audit. |
| Database | Full checks plus migration validation | SQL review, representative data, constraints, compatibility, integrity and recovery. |
| Analytics/time/units | Table-driven unit plus API/UI tests | Date/timezone boundaries, incomplete data, conversions and aggregation. |
| Deployment/configuration | Full checks | Target/config review, migration state, logs and post-deploy smoke. |

## Requirement verification status

All current PRD requirements map to feature SDDs and code, but none map to an automated test file. Source inspection is the bootstrap evidence; it is not release-level behavioral verification. Live Firebase, Vercel, and PostgreSQL state was not inspected.
