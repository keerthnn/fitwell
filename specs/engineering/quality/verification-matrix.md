---
id: quality-verification-matrix
title: Verification Matrix
status: active
authority: binding-process
last_verified: null
---

# Verification matrix

## Purpose

This matrix defines the minimum evidence by change category. Add focused checks when risk exceeds the baseline.

| Change category | Automated baseline | Required focused evidence |
| --- | --- | --- |
| Documentation only | Link/path validation and diff check | Authority, status, consistency, and no implementation drift |
| UI/copy/layout | Lint, typecheck, focused component tests | Mobile/desktop, keyboard/focus, loading/empty/error/success |
| Client data flow | Lint, typecheck, focused tests, build | Latency, duplicate action, failure, stale state, API contract |
| API read | Lint, typecheck, handler tests, build | Method, input, signed-out, ownership/admin, not found, safe error |
| API mutation | API-read baseline plus persistence tests | Side effects, transaction, repeat/idempotency, partial failure |
| Authentication | Full relevant suite and build | Signed-out/in, invalid/expired, disabled/deleted, provider/config evidence |
| Authorization/admin | Full relevant suite and build | Cross-user, normal-user/admin, revoked role, disclosure, audit |
| Database schema | Lint, typecheck, tests, build, migration validation | SQL review, representative data, integrity, compatibility, recovery |
| Analytics/time/units | Pure table-driven tests plus API/UI tests | Timezone/date boundaries, conversions, incomplete/deleted data |
| Assets/catalogue | Relevant tests and asset verification | Missing/inactive/fallback, seed repeatability, visual inspection |
| Deployment/configuration | Full repository checks | Target/config review, runbook execution, logs, post-deploy smoke |
| Recovery | Scenario-specific checks | Tabletop or tested restore/roll-forward and integrity evidence |

## Repository commands

Use the repository's canonical lint, test, typecheck, build, and asset-verification commands as applicable. The command list in `AGENTS.md` and package scripts is executable authority; this matrix owns when categories are required.

## Evidence format

Record command, environment, result, and material warnings. Manual scenarios record actor, precondition, action, and observed outcome. “Not run” requires a reason and blocks completion when the matrix marks the evidence required.

## Full SDD

Verification maps every acceptance criterion and changed requirement to evidence, discloses design deviations, synchronizes canonical documentation, and obtains project-owner approval before Archive.
