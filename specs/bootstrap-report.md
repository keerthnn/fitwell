---
id: fitwell-bootstrap-report-2026-08-15
title: FitWell Documentation Bootstrap Report
status: active
authority: informational
last_verified: 2026-08-15
---

# FitWell documentation bootstrap report

## Outcome

The existing FitWell repository has been bootstrapped into the authoritative documentation system. Product, requirement, architecture, feature, API, database, decision, integration, operations, and quality documents now describe only behavior and structure visible in source as of 2026-08-15. No implementation file was changed as part of the bootstrap.

## Documents populated

| Phase | Populated documents | Result |
| --- | --- | --- |
| Product | [Product brief](product/product-brief.md), [feature catalog](product/feature-catalog.md), [current-state roadmap](product/roadmap.md) | Implemented and partial capabilities are separated from explicitly absent scope. |
| PRDs | [System qualities](prds/system-qualities.md) and ten [domain PRDs](prds/domains/README.md) | 121 observable requirement IDs; every domain PRD links its feature SDD. |
| Architecture | [System overview](engineering/architecture/system-overview.md), [application boundaries](engineering/architecture/application-boundaries.md), [frontend](engineering/architecture/frontend-architecture.md), [backend](engineering/architecture/backend-architecture.md), [API](engineering/architecture/api-architecture.md), [authentication flow](engineering/architecture/authentication-flow.md), and [authorization model](engineering/architecture/authorization-model.md) | Current monolith, trust boundaries, providers, and dependency flow documented. |
| Feature design | Ten [feature SDDs](engineering/features/README.md) | Scope, flows, responsibilities, APIs, data, failure/security behavior, edge cases, code maps, PRD links, and ADR links documented. |
| API | [Conventions](engineering/api/api-conventions.md), [errors/validation](engineering/api/errors-and-validation.md), and [endpoint catalog](engineering/api/endpoint-catalog.md) | All 65 route files match one catalog entry; no invented or missing route. |
| Database | [Design](engineering/database/database-design.md), [lifecycle](engineering/database/data-lifecycle.md), [indexes](engineering/database/indexes-and-performance.md), and [migration policy](engineering/database/migration-policy.md) | All 13 Prisma models, aggregate boundaries, relations, lifecycle, query-driven index rationale, and three migrations covered without copying schema. |
| Decisions | [Six accepted ADRs](engineering/decisions/README.md) | Records only the visible monolith, Firebase, UID mapping, Prisma/PostgreSQL, Axios wrapper, and database-backed admin decisions. |
| Integrations | [Firebase](engineering/integrations/firebase.md), [Vercel](engineering/integrations/vercel.md), and [PostgreSQL hosting](engineering/integrations/postgresql-hosting.md) | Repository-visible responsibilities documented; console/provider facts remain unknown. |
| Operations | [Configuration, environments, deployment, database, and recovery](engineering/operations/README.md) | Existing commands and safeguards documented; deployment/recovery stay draft where execution is unverified. |
| Quality | [Testing strategy](engineering/quality/testing-strategy.md) and [verification matrix](engineering/quality/verification-matrix.md) | Current empty test-suite state and future evidence rules documented. |

## Traceability verification

- Every domain PRD links to its implemented feature SDD.
- Every feature SDD links to its relevant PRD and contains real code paths.
- All 121 requirement identifiers referenced by feature SDD frontmatter resolve to active PRD or system-quality requirements.
- All 65 documented API paths exactly match the 65 files under `src/pages/api`, including the `sync-user` re-export.
- Database documents reference actual Prisma models and migrations; the schema remains exact field authority.
- Local Markdown link validation passed outside intentional template placeholders.
- Source-path validation found no unresolved implementation path after correcting the administration page path and rest/activity module maps.

## Repository verification performed

| Check | Result |
| --- | --- |
| `pnpm run lint` | Passed. |
| `pnpm run typecheck` | Passed. |
| `pnpm run build` | Passed; Next.js reported all 65 API routes and 41 generated static pages. |
| `pnpm run verify:assets` | Passed; 160 approved assets and image resolution for 246 exercises verified. |
| `pnpm run test` | Did not pass because Vitest found no files matching `test cases/**/*.test.ts(x)`. This is an absence-of-tests gap, not a failing behavior test. |

## Missing information

- Firebase Console state: actual projects, enabled providers, authorized domains, quotas, logging, and credential rotation.
- Vercel project state: Git/branch linkage, preview policy, variable scopes, regions/limits, deployment protection, logs, and rollback.
- Hosted PostgreSQL state: provider/version/region, TLS and pool limits, migration state, monitoring, backups, recovery objectives, and restore tests.
- Original dates, authors, alternatives, and rationale for the six reverse-engineered architectural decisions.
- Production data volume, query plans, latency, capacity, and real-user accessibility evidence.

## Areas requiring manual review

- Exercise catalogue cursor loading is supported by the API but not exercised by the current member page.
- Workout pagination uses an identifier cursor with a non-unique workout-date sort; representative stability has no tests.
- The `resumeWorkout` browser wrapper asserts a `Workout` response while the handler returns `{ success: true }`.
- Multiple workouts may be `IN_PROGRESS`; completed workouts and their children can still be edited.
- Authentication stores the ID token in a JavaScript-written cookie rather than an HttpOnly server-issued cookie.
- Local user disable/restore/delete behavior does not demonstrate a matching Firebase identity mutation.
- Analytics `currentStreak` is always zero; frequency and personal-best data are returned but not rendered; personal analytics uses server locale/timezone and displays kilograms.
- Deployment and recovery procedures have not been executed against live targets and therefore remain draft.

## Potential documentation gaps

The docs now match static repository evidence, but automated behavioral traceability is empty because no tests exist. Live-provider facts, production operations, recovery evidence, accessibility results, and representative performance evidence require authorized inspection or execution before they can be promoted from unknown. The historical files under `docs/` may be useful context but are non-authoritative and can be stale; `/specs` and current executable artifacts govern conflicts.

## Maintenance handoff

Future behavior changes must update the owning PRD/SDD/API/database/ADR or operational document in the same change. Test paths should be added to SDD frontmatter and requirement traceability as tests are created. Change `last_verified` only after rechecking the named authoritative source or external system.
