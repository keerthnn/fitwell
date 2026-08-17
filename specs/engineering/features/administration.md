---
id: sdd-administration
title: Administration
status: active
authority: engineering
requirements: [ADMIN-001, ADMIN-002, ADMIN-003, ADMIN-004, ADMIN-005, ADMIN-006, ADMIN-007, ADMIN-008, ADMIN-009, ADMIN-010, ADMIN-011, ADMIN-012, SEC-001, SEC-002, SEC-004, DATA-004]
decisions: [ADR-0002, ADR-0003, ADR-0004, ADR-0005, ADR-0006]
code: [src/pages/system-admin/, src/components/admin/, src/pages/api/admin/, src/components/AdminPageGuard.tsx, src/components/AdminLayout.tsx, src/components/context.tsx, src/lib/auth/requireAdmin.ts, src/lib/admin/audit.ts]
tests: []
last_verified: 2026-08-15
---

# Administration

## Scope and goals

Administration is the protected control surface for summaries, users, administrator grants, exercises, built-in workout plans, workouts, feedback, and audit history. Privileged authorization comes from database-backed `AdminAccess` records and selected mutations append `AdminAuditLog` entries. Configurable roles and granular permissions are not implemented.

## User flow

1. `AdminPageGuard` waits for authentication and `/api/admin/get-admin-status`.
2. A non-administrator is redirected; an administrator enters the `/system-admin` shell.
3. List pages query administrator routes with implemented search, filters, ordering, and cursors.
4. Focused handlers perform mutations and the UI refreshes visible state.
5. Audited handlers record actor, action, entity type, entity identifier, and non-secret metadata.

## Component responsibilities

- The authentication context exposes the signed-in user; `AdminPageGuard` calls the status endpoint and is navigation behavior, not the security boundary.
- `src/pages/system-admin/` owns resource screens; `AdminDataList` supplies shared list presentation and `ExerciseAdminForm` owns exercise input.
- `requireAdmin` verifies server access. `src/lib/admin/audit.ts` writes audit records, while each handler selects audited successful actions.

## API and database usage

All privileged operations use `/api/admin/*` and read or mutate `User`, `AdminAccess`, `AdminAuditLog`, `Exercise`, `WorkoutPlan`, `Workout`, `Feedback`, and their children. Multi-row destructive or replacement operations use Prisma transactions where implemented. Summaries are derived by queries rather than stored snapshots.

## Failure handling and security

Unauthenticated requests return 401, authenticated non-administrators 403, invalid inputs 400, concealed or absent resources generally 404, and last-administrator or state conflicts 409. Every privileged route invokes `requireAdmin`; no client role claim is authoritative. Audit metadata must exclude tokens, credentials, and unnecessary personal content.

## Edge cases and current limits

- Removing, disabling, or deleting the last active administrator is blocked.
- User disablement affects local API access; the repository does not prove a corresponding Firebase Console action.
- Account deletion keeps a local tombstone with an anonymized email.
- Exercise and built-in plan archive/restore use flags; audit coverage is handler-selected rather than database-triggered.
- No automated tests exist under the configured test directory.

## Code map

| Concern | Implementation |
| --- | --- |
| Pages and shell | `src/pages/system-admin/`, `src/components/AdminLayout.tsx` |
| Shared UI | `src/components/admin/` |
| Client access | `src/components/context.tsx`, `src/components/AdminPageGuard.tsx` |
| Server access | `src/lib/auth/requireAdmin.ts` |
| Audit writer | `src/lib/admin/audit.ts` |
| Handlers | `src/pages/api/admin/` |
| Access and audit data | `prisma/schema.prisma` (`AdminAccess`, `AdminAuditLog`) |

## Related requirements

This design implements [ADMIN-001 through ADMIN-012](../../prds/domains/administration.md) and relies on [SEC-001, SEC-002, SEC-004, and DATA-004](../../prds/system-qualities.md).
