---
id: api-endpoint-catalog
title: API Endpoint Catalog
status: active
authority: binding-engineering
requirements: [AUTH-005, PROFILE-001, ONBOARD-005, EXERCISE-001, WORKOUT-001, PLAN-001, DASH-001, ANALYTICS-001, FEEDBACK-001, ADMIN-001, SEC-002]
code: [src/pages/api/]
tests: []
last_verified: 2026-08-15
---

# API endpoint catalog

## Reading the catalog

This inventory contains all 65 route files exposed by `src/pages/api`. `Member` means a verified Firebase token plus an active local `User`; `Admin` additionally means a current `AdminAccess` row. All member resource operations are owner-scoped unless stated otherwise. Standard 401/403/405 and unexpected-error behavior is defined in [Errors and validation](errors-and-validation.md). `Input/result` summarizes observable data and is not a substitute for `src/utils/types.ts` or runtime validators. No direct automated endpoint tests exist.

## Authentication and profiles

| Method and path | Access | Input/result and side effect | Requirement | Handler |
| --- | --- | --- | --- | --- |
| POST `/api/auth/create-user` | Token | Verifies token; creates or updates local user identity; 200 name, 400 email absent, 403 disabled | AUTH-005 | `src/pages/api/auth/create-user.ts` |
| POST `/api/auth/sync-user` | Token | Exact re-export of `create-user`; used by the browser authentication context | AUTH-005 | `src/pages/api/auth/sync-user.ts` |
| GET `/api/user/get-profile-status` | Member | Returns whether the caller has a profile and whether onboarding is complete | ONBOARD-001 | `src/pages/api/user/get-profile-status.ts` |
| GET `/api/user/get-user-profile` | Member | Returns caller profile or null/absence result implemented by handler | PROFILE-002 | `src/pages/api/user/get-user-profile.ts` |
| POST `/api/user/create-profile` | Member | Valid profile body; creates one owner profile; 201, 409 if present | PROFILE-001 | `src/pages/api/user/create-profile.ts` |
| POST `/api/user/update-profile` | Member | Valid partial profile body; updates owner profile; 200, 404 absent | PROFILE-003 | `src/pages/api/user/update-profile.ts` |
| DELETE `/api/user/delete-profile` | Member | Deletes caller profile and returns success | PROFILE-008 | `src/pages/api/user/delete-profile.ts` |
| DELETE `/api/user/delete-account` | Member | Requires confirmation; cascades/anonymizes local account data; protects last admin | PROFILE-009 | `src/pages/api/user/delete-account.ts` |

## Exercise catalog

| Method and path | Access | Input/result and side effect | Requirement | Handler |
| --- | --- | --- | --- | --- |
| GET `/api/exercises/get-exercises` | Member | Validated search/filter/pagination query; returns active exercises and cursor | EXERCISE-001 | `src/pages/api/exercises/get-exercises.ts` |
| GET `/api/exercises/get-exercise-by-id` | Member | `id`; returns active exercise or 404 | EXERCISE-005 | `src/pages/api/exercises/get-exercise-by-id.ts` |
| POST `/api/admin/exercises/create` | Admin | Valid exercise body; creates exercise and audit entry; 201 | ADMIN-004 | `src/pages/api/admin/exercises/create.ts` |
| PATCH `/api/admin/exercises/update` | Admin | `id` plus valid fields; updates exercise and audits | ADMIN-004 | `src/pages/api/admin/exercises/update.ts` |
| POST `/api/admin/exercises/archive` | Admin | Valid `id`; sets inactive and audits | ADMIN-004 | `src/pages/api/admin/exercises/archive.ts` |
| POST `/api/admin/exercises/restore` | Admin | Valid `id`; sets active and audits | ADMIN-004 | `src/pages/api/admin/exercises/restore.ts` |

## Workouts and workout exercises

| Method and path | Access | Input/result and side effect | Requirement | Handler |
| --- | --- | --- | --- | --- |
| POST `/api/workouts/create-workout` | Member | Name/date/mode; creates LIVE or PLAN in progress, QUICK_ENTRY draft; 201 id | WORKOUT-001 | `src/pages/api/workouts/create-workout.ts` |
| GET `/api/workouts/get-workouts` | Member | Valid search/status/mode/date/cursor query; returns owned list | WORKOUT-010 | `src/pages/api/workouts/get-workouts.ts` |
| GET `/api/workouts/get-workout-by-id` | Member | `id`; returns owned nested workout or 404 | WORKOUT-009 | `src/pages/api/workouts/get-workout-by-id.ts` |
| PATCH `/api/workouts/update-workout` | Member | Valid metadata; updates owned workout | WORKOUT-008 | `src/pages/api/workouts/update-workout.ts` |
| DELETE `/api/workouts/delete-workout` | Member | Valid `id`; cascades owned workout aggregate | WORKOUT-012 | `src/pages/api/workouts/delete-workout.ts` |
| POST `/api/workouts/duplicate-workout` | Member | Source `id`; clones nested workout as incomplete draft; 201 id | WORKOUT-011 | `src/pages/api/workouts/duplicate-workout.ts` |
| POST `/api/workouts/pause-workout` | Member | `id`; changes owned IN_PROGRESS workout to DRAFT | WORKOUT-006 | `src/pages/api/workouts/pause-workout.ts` |
| POST `/api/workouts/resume-workout` | Member | Valid `id`; conditionally changes DRAFT to IN_PROGRESS; 409 otherwise | WORKOUT-006 | `src/pages/api/workouts/resume-workout.ts` |
| POST `/api/workouts/complete-workout` | Member | `id`; requires a completed set, stores completion/duration | WORKOUT-007 | `src/pages/api/workouts/complete-workout.ts` |
| POST `/api/workout-exercises/add-exercise` | Member | Workout/exercise IDs; appends exercise to owned workout; 201 | WORKOUT-002 | `src/pages/api/workout-exercises/add-exercise.ts` |
| PATCH `/api/workout-exercises/update-exercise` | Member | Valid association ID/notes; updates owned workout exercise | WORKOUT-002 | `src/pages/api/workout-exercises/update-exercise.ts` |
| DELETE `/api/workout-exercises/delete-exercise` | Member | Association ID; removes owned workout exercise and sets | WORKOUT-002 | `src/pages/api/workout-exercises/delete-exercise.ts` |
| POST `/api/workout-exercises/reorder-exercises` | Member | Workout ID and ordered association IDs; updates order transactionally | WORKOUT-003 | `src/pages/api/workout-exercises/reorder-exercises.ts` |
| POST `/api/workout-exercises/save-sets` | Member | Association ID and tracking-compatible set array; replaces all sets | WORKOUT-004 | `src/pages/api/workout-exercises/save-sets.ts` |

## Workout plans

| Method and path | Access | Input/result and side effect | Requirement | Handler |
| --- | --- | --- | --- | --- |
| GET `/api/workout-plans/list` | Member | Search/visibility query; returns owned private and active built-in plans | PLAN-001 | `src/pages/api/workout-plans/list.ts` |
| GET `/api/workout-plans/get-by-id` | Member | `id`; returns visible plan with ordered exercises or 404 | PLAN-002 | `src/pages/api/workout-plans/get-by-id.ts` |
| POST `/api/workout-plans/create` | Member | Valid plan and exercises; creates owned plan transactionally; 201 | PLAN-003 | `src/pages/api/workout-plans/create.ts` |
| PATCH `/api/workout-plans/update` | Member | Valid owned plan; replaces exercise prescription transactionally | PLAN-004 | `src/pages/api/workout-plans/update.ts` |
| POST `/api/workout-plans/archive` | Member | `id`, `archived`; updates only owned non-built-in plan | PLAN-005 | `src/pages/api/workout-plans/archive.ts` |
| POST `/api/workout-plans/duplicate` | Member | Visible source `id`; creates owned copy with exercises; 201 | PLAN-006 | `src/pages/api/workout-plans/duplicate.ts` |
| POST `/api/workout-plans/start-workout` | Member | Visible plan `id`; creates PLAN workout and prescribed nested sets; 201 id | PLAN-007 | `src/pages/api/workout-plans/start-workout.ts` |
| POST `/api/admin/workout-plans/create` | Admin | Valid built-in plan; creates with exercises and audits; 201 | ADMIN-005 | `src/pages/api/admin/workout-plans/create.ts` |
| PATCH `/api/admin/workout-plans/update` | Admin | Valid built-in plan; replaces prescription and audits | ADMIN-005 | `src/pages/api/admin/workout-plans/update.ts` |
| POST `/api/admin/workout-plans/archive` | Admin | Built-in `id`; archives and audits | ADMIN-005 | `src/pages/api/admin/workout-plans/archive.ts` |
| POST `/api/admin/workout-plans/restore` | Admin | Built-in `id`; restores and audits | ADMIN-005 | `src/pages/api/admin/workout-plans/restore.ts` |

## Dashboard and analytics

| Method and path | Access | Input/result | Requirement | Handler |
| --- | --- | --- | --- | --- |
| GET `/api/dashboard/summary` | Member | Returns active workout, weekly goal/progress, activity streak, recent workouts, frequent exercises, and plans | DASH-001 | `src/pages/api/dashboard/summary.ts` |
| GET `/api/analytics/summary` | Member | Preset/custom range; returns completed-workout volume, duration, frequency, bests, and plan usage | ANALYTICS-001 | `src/pages/api/analytics/summary.ts` |
| GET `/api/admin/dashboard/summary` | Admin | Returns user, workout, exercise, and plan counts | ADMIN-007 | `src/pages/api/admin/dashboard/summary.ts` |
| GET `/api/admin/analytics/summary` | Admin | Date range; returns cross-user aggregate analytics | ADMIN-008 | `src/pages/api/admin/analytics/summary.ts` |

## Feedback

| Method and path | Access | Input/result and side effect | Requirement | Handler |
| --- | --- | --- | --- | --- |
| POST `/api/feedback/create` | Member | Category, subject, initial content; creates conversation/message; 201 | FEEDBACK-001 | `src/pages/api/feedback/create.ts` |
| GET `/api/feedback/list` | Member | Search/category/status/cursor/limit; returns owned conversations | FEEDBACK-002 | `src/pages/api/feedback/list.ts` |
| GET `/api/feedback/get-by-id` | Member | `id`; returns owned conversation, messages, and delete capability | FEEDBACK-003 | `src/pages/api/feedback/get-by-id.ts` |
| POST `/api/feedback/reply` | Member | `id`, content; appends message and sets OPEN; 201; closed is 409 | FEEDBACK-004 | `src/pages/api/feedback/reply.ts` |
| DELETE `/api/feedback/delete` | Member | `id`; deletes only before any admin message; 409 otherwise | FEEDBACK-005 | `src/pages/api/feedback/delete.ts` |
| GET `/api/admin/feedback/list` | Admin | Cross-user search/category/status/cursor/limit list | ADMIN-009 | `src/pages/api/admin/feedback/list.ts` |
| GET `/api/admin/feedback/get-by-id` | Admin | `id`; returns any conversation and ordered messages | ADMIN-009 | `src/pages/api/admin/feedback/get-by-id.ts` |
| POST `/api/admin/feedback/reply` | Admin | `id`, content; appends admin message, sets RESPONDED, audits; 201 | ADMIN-009 | `src/pages/api/admin/feedback/reply.ts` |
| POST `/api/admin/feedback/close` | Admin | `id`; sets CLOSED and audits once; repeat-safe 200 | ADMIN-009 | `src/pages/api/admin/feedback/close.ts` |

## Administration: access, users, audit, and workouts

| Method and path | Access | Input/result and side effect | Requirement | Handler |
| --- | --- | --- | --- | --- |
| GET `/api/admin/get-admin-status` | Admin | Returns `{ isAdmin: true }`; non-admin is rejected | ADMIN-001 | `src/pages/api/admin/get-admin-status.ts` |
| GET `/api/admin/admin-access/list` | Admin | Returns administrator grant records and users | ADMIN-003 | `src/pages/api/admin/admin-access/list.ts` |
| POST `/api/admin/admin-access/grant` | Admin | Target active user ID; upserts grant and audits | ADMIN-003 | `src/pages/api/admin/admin-access/grant.ts` |
| POST `/api/admin/admin-access/remove` | Admin | Target ID; removes grant, preserves last admin, audits | ADMIN-003 | `src/pages/api/admin/admin-access/remove.ts` |
| GET `/api/admin/users/list` | Admin | Implemented filters; returns users and currently null cursor | ADMIN-002 | `src/pages/api/admin/users/list.ts` |
| GET `/api/admin/users/get-by-id` | Admin | User `id`; returns user with related detail or 404 | ADMIN-002 | `src/pages/api/admin/users/get-by-id.ts` |
| POST `/api/admin/users/disable` | Admin | Target ID and disabled state; protects last admin; audits | ADMIN-002 | `src/pages/api/admin/users/disable.ts` |
| POST `/api/admin/users/restore` | Admin | Target ID; clears disabled/deleted local state and audits | ADMIN-002 | `src/pages/api/admin/users/restore.ts` |
| DELETE `/api/admin/users/delete` | Admin | Target ID; local cascade/anonymization, last-admin protection, audit | ADMIN-002 | `src/pages/api/admin/users/delete.ts` |
| GET `/api/admin/audit-logs/list` | Admin | Returns audit entries with implemented filtering/ordering | ADMIN-010 | `src/pages/api/admin/audit-logs/list.ts` |
| GET `/api/admin/workouts/list` | Admin | Cross-user workout list; returns null cursor | ADMIN-006 | `src/pages/api/admin/workouts/list.ts` |
| GET `/api/admin/workouts/get-by-id` | Admin | Workout `id`; returns nested workout or 404 | ADMIN-006 | `src/pages/api/admin/workouts/get-by-id.ts` |
| DELETE `/api/admin/workouts/delete` | Admin | Workout `id`; deletes aggregate and audits | ADMIN-006 | `src/pages/api/admin/workouts/delete.ts` |

## Count and authority

The tables contain 65 concrete routes: 64 implementation handlers plus `/api/auth/sync-user`, which re-exports the create-user handler. Route existence and exact executable shapes are authoritative in `src/pages/api`, `src/utils/types.ts`, and validators. Any route addition, removal, method change, access change, or side-effect change must update this catalog in the same change.
