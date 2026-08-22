---
id: architecture-authorization-model
title: Authorization Model
status: active
authority: binding-engineering
requirements: [SEC-002, SEC-003, SEC-004, SEC-005, ADMIN-001, PLAN-002, PLAN-003, FEEDBACK-010]
decisions: []
code: [src/lib/auth/utils.ts, src/lib/auth/requireAdmin.ts, src/lib/workoutPlans/access.ts, src/pages/api/]
tests: []
last_verified: 2026-08-15
---

# Authorization model

## Principals

- **Visitor:** no verified Firebase token.
- **Member:** verified Firebase UID whose local user is not disabled or deleted.
- **Administrator:** member whose UID has an `AdminAccess` row.

## Resource classes

| Resource | Access rule |
| --- | --- |
| User/Profile/Activity | Current UID; explicit administrator user endpoints are separate |
| Workout and nested exercises/sets | Workout owner, except administrator inspection/deletion |
| Private workout plan | Matching owner and not built-in |
| Built-in workout plan | Null owner, built-in, active, non-archived for members; admin endpoints manage lifecycle |
| Exercise | Active for members; admins may include/manage inactive |
| Feedback/messages | Conversation owner; admin feedback endpoints access all |
| Admin access/audit logs | Administrator only |

## Enforcement patterns

- Top-level member queries include `userId` in the Prisma predicate.
- Nested workout-exercise/set handlers traverse to the workout owner before mutation.
- Visible-plan lookup uses a shared OR predicate for owned private or active built-in plans.
- Admin handlers call `requireAdmin` before reading or mutating.
- Client guards and hidden navigation improve UX but are not authorization.

## Account state

Disabled or deleted local accounts receive 403. Restore applies only to disabled, non-deleted accounts. Local deletion removes owned data and leaves a disabled/deleted user tombstone.

## Last-admin invariant

Admin access removal and account deletion check that at least one active administrator remains. The invariant lacks automated test evidence.

## Disclosure

Member ownership failures commonly return 404, avoiding disclosure of another member's resource. Missing administrator access returns 403. Error shapes are not uniform.

## Verification gap

There are no automated cross-user or non-admin rejection tests. Authorization was derived statically from predicates and helper use.
