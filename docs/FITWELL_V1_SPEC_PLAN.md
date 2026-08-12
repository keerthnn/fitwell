# FitWell Version 1: Current-State Specification and Delivery Plan

**Document status:** Living specification  
**Baseline date:** 2026-08-12  
**Code baseline:** `1179fe6` (`main`) before this document was added  
**Product stage:** Local-development Version 1 candidate  
**Primary stack:** Next.js Pages Router, React, MUI, Firebase Authentication, PostgreSQL, Prisma

## 1. Purpose

This document describes what FitWell currently provides, the behavior the code is intended to guarantee, the evidence available for that behavior, and the remaining work needed for a reliable Version 1 release.

It is both:

- an **as-built specification**, derived from the current pages, API routes, validators, Prisma schema, assets, and project guidance; and
- a **delivery plan**, with prioritized gaps, acceptance criteria, and release gates.

This document does not claim that a feature is production-ready merely because code exists. Status is classified as follows:

| Status | Meaning |
| --- | --- |
| Implemented | The end-to-end code path exists and the repository compiles. |
| Partial | The main path exists, but part of the contract, UI, test coverage, or edge behavior is incomplete. |
| Planned | The capability is intentionally listed for future work and is not in the current product. |
| Needs manual verification | Static checks pass, but the authenticated browser/database flow has not been exercised as part of this audit. |

## 2. Product definition

### 2.1 Product goal

FitWell is a focused workout tracker that lets an authenticated user maintain a fitness profile, browse an exercise catalogue, create or follow workout plans, record live or retrospective workouts, and review workout-focused progress. Administrators can manage the shared catalogue and oversee local application data.

### 2.2 Primary actors

| Actor | Goal | Access boundary |
| --- | --- | --- |
| Visitor | Understand the product and authenticate. | Public landing and auth routes only. |
| Member | Set up a profile, plan training, record workouts, and view personal results. | Data scoped to the verified Firebase UID plus active built-in content. |
| Administrator | Maintain global exercises/plans and administer users, workouts, access, and audit data. | Server-enforced `AdminAccess` membership. |

### 2.3 Version 1 outcomes

A Version 1 user should be able to:

1. Create or access an account with email/password or Google authentication.
2. Complete onboarding and choose core training preferences.
3. Discover exercises by search, muscle group, equipment, and movement.
4. Start a live workout, record sets, use a rest timer, pause/resume, and complete the workout.
5. Add a past workout through quick entry and edit its exercises/sets.
6. Create, edit, duplicate, archive, and start a private Workout Plan.
7. Start a workout from an administrator-managed built-in plan.
8. View dashboard summaries and workout analytics.
9. Edit profile and appearance settings or delete the local application account.
10. Use responsive member and administrator navigation.

### 2.4 Explicit non-goals for Version 1

The following are intentionally outside the current schema, routes, and navigation:

- nutrition and calorie tracking;
- medical, health, or injury records;
- weight-history charts or check-ins;
- achievements or gamification;
- community discovery, social feeds, comments, or sharing;
- public/user-shareable workout plans;
- cloud deployment and production operations;
- Firebase Authentication identity deletion.

These features should not be added without a separate product specification and schema/security review.

## 3. System overview

### 3.1 Architecture

| Layer | Current implementation | Responsibility |
| --- | --- | --- |
| UI routing | Next.js Pages Router under `src/pages/` | Public, member, onboarding, and admin screens. |
| UI system | React 19 and MUI 7 | Responsive layout, shared controls, light/dark/system themes. |
| Client API | Axios wrappers in `src/utils/spec.ts` | Same-origin, typed browser-to-API calls. |
| Authentication | Firebase client + Firebase Admin | Sign-in and server verification of the `idToken` cookie. |
| Authorization | UID ownership filters and `requireAdmin` | Member data isolation and admin-only operations. |
| Server API | 56 Pages Router API handlers | Validation, business rules, Prisma queries, and JSON responses. |
| Persistence | PostgreSQL via shared Prisma client | Users, profiles, exercises, workouts, plans, activity, admin access, and audit logs. |
| Assets | Local WebP/PNG assets plus an asset registry | Exercise, equipment, muscle, plan, and workout imagery with fallbacks. |

### 3.2 Application shells

- `/` and `/auth/*` render in the public shell.
- `/onboarding` renders without the member navigation shell.
- `/system-admin/*` renders in the guarded admin shell.
- All other member pages render in the authenticated application shell.
- Desktop navigation uses a collapsible sidebar; mobile navigation uses a bottom bar and additional navigation drawer.
- Theme preference is `light`, `dark`, or `system` and is persisted in `localStorage` as `fitwell.theme`.
- The workout-aware rest timer persists in `localStorage` as `fitwell.restTimer`, is scoped to the signed-in member, and remains visible across member routes.

## 4. Functional specification: current implementation

### 4.1 Authentication and account lifecycle

| ID | Requirement | Status | Implementation evidence |
| --- | --- | --- | --- |
| AUTH-01 | A visitor can sign up with email and password. | Implemented; needs manual verification | `/auth/sign-up`, Firebase client helper. |
| AUTH-02 | A visitor can sign in with email/password or Google. | Implemented; needs manual verification | `/auth/sign-in`, Firebase email and popup helpers. |
| AUTH-03 | A visitor can request a password reset email. | Implemented; needs manual verification | `/auth/forgot-password`. |
| AUTH-04 | The client stores the current Firebase ID token in a same-origin `idToken` cookie and removes it on sign-out. | Implemented | `AuthContextProvider`. |
| AUTH-05 | A successful Firebase session creates or updates the matching PostgreSQL `User`. | Implemented | `POST /api/auth/sync-user`. |
| AUTH-06 | A disabled/deleted application account cannot be silently recreated by signing in again. | Implemented | Sync rejects `deletedAt` or `isDisabled`. |
| AUTH-07 | A signed-in visitor at `/` or `/auth/*` is sent to onboarding or the dashboard based on profile state. | Implemented; needs manual verification | Auth context redirect decision. |
| AUTH-08 | Member pages redirect signed-out users to sign-in. | Implemented; needs manual verification | `AuthenticatedPage`. |
| AUTH-09 | User-scoped API handlers verify the ID token and derive ownership from the verified UID. | Implemented | `getUserIdOrSetError` used across member APIs. |
| AUTH-10 | Application account deletion removes member-owned PostgreSQL data, revokes admin access, and leaves a disabled tombstone. | Implemented; needs tests | `DELETE /api/user/delete-account`. |
| AUTH-11 | The last active administrator cannot delete their own application account. | Implemented; needs tests | Account deletion returns conflict until another active admin exists. |
| AUTH-12 | Firebase Authentication identities are preserved during application account deletion. | Implemented by design | No Firebase Admin deletion call exists. |

**Account deletion postcondition:** workouts, private workout plans, profile, and admin access are removed; identifying local fields are cleared/replaced; `isDisabled` is true; `deletedAt` is populated; the `User.id` tombstone remains.

### 4.2 Onboarding and profile

| ID | Requirement | Status | Implementation evidence |
| --- | --- | --- | --- |
| PROF-01 | A new member can create a profile during onboarding. | Implemented; needs manual verification | `/onboarding`, `POST /api/user/create-profile`. |
| PROF-02 | Onboarding collects name, optional gender/date of birth, optional body measures, goal, experience, weekly target, typical duration, units, and timezone. | Implemented | `ProfileForm`, `UserProfile`. |
| PROF-03 | Completing onboarding sets `onboardingCompleted` and routes to the dashboard. | Implemented; needs manual verification | Onboarding submit flow. |
| PROF-04 | A member can view and edit the profile. | Implemented; needs manual verification | `/profile`, `/profile/edit`. |
| PROF-05 | Metric values are canonical in the database; imperial values are converted for display/input. | Implemented | `src/utils/units.ts`, profile form. |
| PROF-06 | Weekly target is limited to 1–14 workouts; height to 50–300 cm; weight to 1–600 kg; duration to 1–1440 minutes. | Implemented | Runtime profile validator. |
| PROF-07 | A member can delete only the profile without deleting the application account. | API implemented; UI exposure unclear | `DELETE /api/user/delete-profile`; no primary profile action currently calls it. |

### 4.3 Dashboard

| ID | Requirement | Status | Implementation evidence |
| --- | --- | --- | --- |
| DASH-01 | Dashboard greets the member using profile name, account display name, or a fallback. | Implemented | `GET /api/dashboard/summary`. |
| DASH-02 | Dashboard shows workouts this week against weekly target. | Implemented | Completed workouts since Monday. |
| DASH-03 | Dashboard shows current streak, completed-workout total, and total duration. | Implemented | Dashboard aggregation. |
| DASH-04 | Dashboard shows up to five recent completed workouts. | Implemented | Summary response and dashboard panels. |
| DASH-05 | Dashboard surfaces the most recently updated in-progress workout. | Implemented | Active workout query and banner. |
| DASH-06 | Dashboard shows up to four recent private plans and four frequently performed exercises. | Implemented | User-owned active plans and completed-workout exercise counts. |
| DASH-07 | Dashboard supports loading, retryable error, empty, and populated states. | Mostly implemented | Page-level loading/error plus section-level presentation; needs manual state verification. |

### 4.4 Exercise catalogue

| ID | Requirement | Status | Implementation evidence |
| --- | --- | --- | --- |
| EXER-01 | Members can browse active exercises. | Implemented | `/exercises`, `GET /api/exercises/get-exercises`. |
| EXER-02 | Members can search by name and filter by equipment, muscle category, and movement. | Implemented | Debounced filter UI and validated query. |
| EXER-03 | The catalogue supports equipment, movement, tracking type, primary/secondary muscle, compound flag, instructions, and imagery metadata. | Implemented | `Exercise` model and shared type. |
| EXER-04 | Members cannot retrieve inactive exercises. | Implemented | API adds `isActive: true` for non-admin users. |
| EXER-05 | An administrator can include and inspect inactive exercises. | Implemented | Admin-aware catalogue queries. |
| EXER-06 | A member can start a live workout directly from an exercise card. | Implemented; needs manual verification | Creates a live workout, adds the exercise, routes to live session. |
| EXER-07 | Catalogue results are cursor-ready with a 1–100 limit. | API implemented; UI partial | API returns `nextCursor`; current catalogue page does not request subsequent pages. |

### 4.5 Workouts

| ID | Requirement | Status | Implementation evidence |
| --- | --- | --- | --- |
| WORK-01 | Members can list their own workouts and filter by name and status. | Implemented | `/workouts`, `GET /api/workouts/get-workouts`. |
| WORK-02 | Members can start a live workout with optional initial exercises. | Implemented | `/workouts/create`, `POST /api/workouts/create-workout`. |
| WORK-03 | A live workout begins in `IN_PROGRESS` with `startedAt` populated. | Implemented for `LIVE` | Create-workout handler. |
| WORK-04 | Members can add, remove, reorder, and annotate workout exercises. | Implemented at API/component level; reorder integration needs manual verification | Workout-exercise handlers and editor components. |
| WORK-05 | Members can add/remove sets and record reps, kg weight, duration, distance, exercise-wide session rest, and completion. A set cannot be marked complete until its tracking metrics are valid. | Implemented | Live exercise panels and replace-all set save API; completion and saving share tracking-aware validation, and the shared rest snapshot is written to each set. |
| WORK-06 | Set changes in the live page are saved while the member works. | Implemented; needs failure-state verification | Live page message and exercise editor save calls. |
| WORK-07 | A live workout can be paused to `DRAFT` and resumed to `IN_PROGRESS` without leaving the live page. | Implemented | Pause/resume endpoints and live-page lifecycle actions; a workout-paused rest timer follows the same transition. |
| WORK-08 | A workout can be completed only when at least one set is complete. | Implemented | Completion endpoint validation. |
| WORK-09 | Completion records `completedAt` and derives duration when none was supplied. | Implemented | Completion endpoint. |
| WORK-10 | Members can create a quick-entry draft for a past/completed session and then edit details. | Implemented but terminology is partial | `/workouts/quick-entry` creates a `DRAFT`; user must complete it separately. |
| WORK-11 | Members can view workout detail including exercise imagery, sets, exercise notes, and workout notes. | Implemented | `/workouts/[id]`. |
| WORK-12 | Members can edit workout metadata and exercises. | Implemented | `/workouts/[id]/edit`, patch and workout-exercise APIs. |
| WORK-13 | Members can duplicate a workout into a new quick-entry draft with uncompleted copied sets. | Implemented | `POST /api/workouts/duplicate-workout`. |
| WORK-14 | Members can delete only their own workout. | Implemented | Ownership-scoped delete API. |
| WORK-15 | Workout input limits are enforced: name 120, notes 2,000, up to 50 initial exercises, and up to 100 sets per save. | Implemented | Runtime validators. |
| WORK-16 | Workout list cursor pagination can load every result without skips/duplicates. | Partial; correction required | API cursor calculation uses `rows[limit - 1]`; verify/fix before UI pagination. |
| WORK-17 | Only one in-progress workout exists per member. | Not enforced | Dashboard chooses the latest if multiple exist; no DB or API invariant prevents multiples. |
| WORK-18 | Entry-mode transitions are valid and consistent. | Partial | Generic create accepts `PLAN`; `PLAN` creation there can be in progress without `startedAt`. Plan workouts should originate from the plan-start endpoint only. |

### 4.6 Rest timer

| ID | Requirement | Status | Implementation evidence |
| --- | --- | --- | --- |
| TIMER-01 | Completing a set starts rest automatically from the exercise-wide session duration; rest can also be started from the exercise panel. | Implemented | Live exercise panel and workout-aware timer context. |
| TIMER-02 | The timer can pause, resume, add 30 seconds, reset, and skip. | Implemented | Floating warning-colored timer controls. |
| TIMER-03 | Timer state persists across member navigation/reload without leaking between users or workouts. | Implemented | Versioned, authenticated local-storage state with deadline reconciliation. |
| TIMER-04 | Timer expiry is communicated visually and accessibly. | Implemented | Auto-clearing completion pulse and polite live-region status. |
| TIMER-05 | Workout pause/resume pauses/resumes a running rest timer, and workout completion clears it. | Implemented | Live workout lifecycle integration with manual-pause preservation. |

### 4.7 Workout Plans

| ID | Requirement | Status | Implementation evidence |
| --- | --- | --- | --- |
| PLAN-01 | Members can list active built-in plans and their own private plans. | Implemented | `/workout-plans`, plan list API. |
| PLAN-02 | Private plans are visible only to their owner; built-in plans require `userId: null` and `isBuiltIn: true`. | Implemented | Shared plan visibility helper and API filters. |
| PLAN-03 | Members can create a private plan with name, description, difficulty, category, days/week, and ordered exercise prescriptions. | Implemented | Plan form and create API. |
| PLAN-04 | A prescription supports sets, rep range, weight guidance, rest, and notes. | Implemented in data/API; form exposes core set/rep/rest fields | Schema, validator, form components. |
| PLAN-05 | Members can edit or archive only their private non-built-in plans. | Implemented | Ownership and `isBuiltIn: false` filters. |
| PLAN-06 | Members can duplicate a visible plan into a private copy. | Implemented | Duplicate endpoint. |
| PLAN-07 | Members can start a visible plan as an in-progress workout with prescribed exercises and set counts. | Implemented | Start-workout endpoint. |
| PLAN-08 | Started plan workouts keep a nullable source-plan reference and survive plan deletion via `SetNull`. | Implemented | Prisma relation. |
| PLAN-09 | Plan validation requires 1–7 days/week, 1–100 exercises, and 1–20 sets per exercise. | Implemented | Runtime plan validator. |
| PLAN-10 | Archived private plans can be restored by a member. | API supports archive toggle; UI unclear | Member archive endpoint accepts `archived`; no clearly exposed restore list/action. |
| PLAN-11 | Plan list pagination and rich category/difficulty filtering are available. | Not implemented | List is capped at 100 and search-only. |

### 4.8 Personal analytics

| ID | Requirement | Status | Implementation evidence |
| --- | --- | --- | --- |
| AN-01 | Analytics default to completed workouts from the last 30 days. | Implemented | `/analytics`, summary API. |
| AN-02 | An optional custom range must be valid, ordered, and no longer than 366 days. | API implemented; no current range UI | `start`/`end` query parsing. |
| AN-03 | Summary calculates completed count, duration, volume, and exercises performed. | Implemented | Analytics aggregation. |
| AN-04 | Summary calculates muscle distribution, weekday frequency, personal best weight, and plan usage. | API implemented | Response includes all four datasets. |
| AN-05 | Analytics UI presents all returned metrics. | Partial | Current page shows headline totals, muscle distribution, and plan usage; it omits frequency, personal bests, and streak. |
| AN-06 | Analytics returns an accurate current streak. | Not implemented | `currentStreak` is currently hard-coded to `0`. |
| AN-07 | Weight display follows member unit preference. | Partial | Analytics labels volume in kg regardless of profile preference. |

### 4.9 Member settings and experience

| ID | Requirement | Status | Implementation evidence |
| --- | --- | --- | --- |
| SET-01 | A member can choose light, dark, or system theme. | Implemented | Theme provider and selector. |
| SET-02 | A member can sign out. | Implemented | Settings session action. |
| SET-03 | Destructive account deletion requires explicit confirmation. | Implemented | Confirmation dialog plus `confirm=DELETE` API guard. |
| SET-04 | Member navigation is usable on desktop and mobile. | Implemented; needs viewport verification | Sidebar, bottom navigation, and more drawer. |

### 4.10 Administration

| ID | Requirement | Status | Implementation evidence |
| --- | --- | --- | --- |
| ADM-01 | Every admin page is guarded in the client and every admin API is guarded on the server. | Implemented | `AdminPageGuard`, `AdminLayout`, `requireAdmin`. |
| ADM-02 | Admin overview shows user, workout, active-exercise, and built-in-plan counts. | Implemented | `/system-admin`, dashboard summary API. |
| ADM-03 | Admin can list users, inspect a user, disable, restore, or delete local application data. | Implemented; needs manual verification | User pages and APIs. |
| ADM-04 | Admin can list, create, edit, archive, and restore catalogue exercises. | Implemented | Exercise admin pages/APIs. |
| ADM-05 | Admin can list, create, edit, archive, and restore built-in Workout Plans. | Implemented | Workout Plan admin pages/APIs. |
| ADM-06 | Admin can list and delete workouts across users. | Implemented | Workout administration page/APIs. |
| ADM-07 | Admin can grant and remove admin access. | Implemented | Admin-access page/APIs. |
| ADM-08 | The last active administrator cannot be removed. | Implemented; needs tests | Remove-access invariant. |
| ADM-09 | Sensitive mutations create audit events recording actor, action, entity, and time. | Implemented | Admin audit log writes for users, exercises, plans, access, and workout deletion. |
| ADM-10 | Admin can list audit events. | Implemented | Audit-log page/API. |
| ADM-11 | Admin analytics shows completed workouts, active users, and total duration. | Implemented but minimal | Admin analytics summary/page. |
| ADM-12 | Admin list/search/pagination works for large datasets. | Partial | Server-side limits/pagination are minimal; most client wrappers do not expose filters or cursors. |
| ADM-13 | Admin settings provide configurable system behavior. | Not implemented | Current page is informational only. |

## 5. Route inventory

### 5.1 User-facing pages

| Area | Routes | Purpose |
| --- | --- | --- |
| Public/auth | `/`, `/auth/sign-in`, `/auth/sign-up`, `/auth/forgot-password` | Landing, authentication, password reset. |
| Setup/profile | `/onboarding`, `/profile`, `/profile/edit`, `/settings` | Fitness preferences, account presentation, theme, sign-out/deletion. |
| Dashboard | `/dashboard` | Weekly progress, active/recent workouts, plans, frequent exercises. |
| Exercises | `/exercises` | Search/filter catalogue and start from an exercise. |
| Workouts | `/workouts`, `/workouts/create`, `/workouts/quick-entry`, `/workouts/live/[id]`, `/workouts/[id]`, `/workouts/[id]/edit` | History, live logging, retrospective entry, detail, editing. |
| Workout Plans | `/workout-plans`, `/workout-plans/create`, `/workout-plans/[id]`, `/workout-plans/[id]/edit` | Browse, author, inspect, duplicate, archive, and start plans. |
| Analytics | `/analytics` | Workout-focused 30-day summary. |

### 5.2 Administrator pages

| Route | Purpose |
| --- | --- |
| `/system-admin` | Overview counts. |
| `/system-admin/users` and `/system-admin/users/[id]` | User list, detail, disable/restore/delete. |
| `/system-admin/exercises`, `/new`, `/[id]` | Catalogue lifecycle. |
| `/system-admin/workout-plans`, `/new`, `/[id]` | Built-in plan lifecycle. |
| `/system-admin/workouts` | Cross-user workout list and deletion. |
| `/system-admin/analytics` | System totals. |
| `/system-admin/admin-access` | Grant/revoke administrators. |
| `/system-admin/audit-logs` | Administrative mutation history. |
| `/system-admin/settings` | Informational local-environment settings screen. |

## 6. API contract inventory

All routes below are same-origin Pages Router APIs. Member routes require a verified ID-token cookie unless noted; admin routes additionally require `AdminAccess`.

| Domain | Method and route | Contract summary |
| --- | --- | --- |
| Auth | `POST /api/auth/sync-user` | Verify Firebase token, upsert active local user, record daily activity. |
| Profile | `GET /api/user/get-profile-status` | Return profile existence/onboarding state. |
| Profile | `GET /api/user/get-user-profile` | Return current member profile or null. |
| Profile | `POST /api/user/create-profile` | Create a validated profile once. |
| Profile | `POST /api/user/update-profile` | Update an existing validated profile. |
| Profile | `DELETE /api/user/delete-profile` | Delete current profile only. |
| Account | `DELETE /api/user/delete-account?confirm=DELETE` | Delete owned app data and disable/tombstone local account. |
| Dashboard | `GET /api/dashboard/summary` | Return member dashboard aggregates and panels. |
| Analytics | `GET /api/analytics/summary` | Return completed-workout aggregates for a validated date range. |
| Exercises | `GET /api/exercises/get-exercises` | Search/filter active catalogue; admin may include inactive. |
| Exercises | `GET /api/exercises/get-exercise-by-id?id=...` | Read an accessible exercise. |
| Workouts | `GET /api/workouts/get-workouts` | Search/filter/sort/cursor-list current member workouts. |
| Workouts | `GET /api/workouts/get-workout-by-id?id=...` | Read owned workout with ordered exercises/sets. |
| Workouts | `POST /api/workouts/create-workout` | Create live/quick-entry workout. |
| Workouts | `PATCH /api/workouts/update-workout` | Update owned workout metadata. |
| Workouts | `POST /api/workouts/duplicate-workout` | Copy owned workout to a draft. |
| Workouts | `POST /api/workouts/pause-workout` | Move owned in-progress workout to draft. |
| Workouts | `POST /api/workouts/resume-workout` | Move owned draft workout to in progress. |
| Workouts | `POST /api/workouts/complete-workout` | Complete owned workout with at least one completed set. |
| Workouts | `DELETE /api/workouts/delete-workout?id=...` | Delete owned workout. |
| Workout exercises | `POST /api/workout-exercises/add-exercise` | Add an active exercise to an owned workout. |
| Workout exercises | `PATCH /api/workout-exercises/update-exercise` | Update notes on an owned workout exercise. |
| Workout exercises | `POST /api/workout-exercises/reorder-exercises` | Reorder owned workout exercises. |
| Workout exercises | `POST /api/workout-exercises/save-sets` | Transactionally replace sets for an owned workout exercise. |
| Workout exercises | `DELETE /api/workout-exercises/delete-exercise?id=...` | Remove an owned workout exercise. |
| Plans | `GET /api/workout-plans/list` | List visible built-in and private plans. |
| Plans | `GET /api/workout-plans/get-by-id?id=...` | Read a visible plan. |
| Plans | `POST /api/workout-plans/create` | Create a private plan. |
| Plans | `PATCH /api/workout-plans/update` | Replace details/exercises of an owned private plan. |
| Plans | `POST /api/workout-plans/archive` | Archive or restore an owned private plan. |
| Plans | `POST /api/workout-plans/duplicate` | Copy a visible plan into a private plan. |
| Plans | `POST /api/workout-plans/start-workout` | Materialize a visible plan as a live plan workout. |
| Admin | `GET /api/admin/get-admin-status` | Verify admin access for route guard. |
| Admin | `GET /api/admin/dashboard/summary` | Overview counts. |
| Admin | `GET /api/admin/analytics/summary` | System workout/user/duration totals. |
| Admin users | `GET /api/admin/users/list`, `GET /get-by-id` | List or inspect users. |
| Admin users | `POST /api/admin/users/disable`, `POST /restore`, `DELETE /delete` | Manage local account state/data. |
| Admin exercises | `POST /api/admin/exercises/create`, `PATCH /update`, `POST /archive`, `POST /restore` | Manage global exercise catalogue. |
| Admin plans | `POST /api/admin/workout-plans/create`, `PATCH /update`, `POST /archive`, `POST /restore` | Manage built-in plans. |
| Admin workouts | `GET /api/admin/workouts/list`, `GET /get-by-id`, `DELETE /delete` | Inspect/delete workouts across users. |
| Admin access | `GET /api/admin/admin-access/list`, `POST /grant`, `POST /remove` | Manage admin membership. |
| Admin audit | `GET /api/admin/audit-logs/list` | Return recent audit events. |

`src/pages/api/auth/sync-user.ts` re-exports the create-user handler, so it is one behavior exposed through the public sync route rather than a second independent implementation.

## 7. Domain model and invariants

### 7.1 Persisted models

| Model | Purpose | Important rules |
| --- | --- | --- |
| `User` | Local account keyed by Firebase UID. | Unique email; disabled/deleted tombstone blocks resync. |
| `UserProfile` | Fitness preferences and onboarding. | One-to-one with user; canonical metric body measures. |
| `Exercise` | Global movement catalogue. | Unique name/equipment pair; active flag controls member visibility. |
| `Workout` | Dated member workout. | Belongs to one user; status and entry mode are explicit enums. |
| `WorkoutExercise` | Ordered exercise in a workout. | Cascades with workout; links to global exercise. |
| `WorkoutSet` | Performance values for one set. | Supports tracking-type-specific nullable values and completion; `restSeconds` stores the exercise-wide session snapshot consistently across the exercise's sets. |
| `WorkoutPlan` | Built-in or private programme. | Built-in has null owner; private has member owner; archive/active flags. |
| `WorkoutPlanExercise` | Ordered plan prescription. | Sets, rep range, guidance, rest, notes. |
| `UserActivityDay` | One activity aggregate per user/date. | Unique user/date and request count. |
| `AdminAccess` | Server-side administrator membership. | One row per admin user. |
| `AdminAuditLog` | Sensitive admin mutation record. | Restricts deletion of referenced acting admin. |

### 7.2 Workout lifecycle

```text
Live create or plan start -> IN_PROGRESS -> COMPLETED
                              |      ^
                              v      |
                            DRAFT ---+

Quick entry or duplicate -> DRAFT -> IN_PROGRESS -> COMPLETED
```

Required transition rules:

- `IN_PROGRESS -> DRAFT` is pause.
- `DRAFT -> IN_PROGRESS` is resume and refreshes `startedAt`.
- Any completion attempt requires ownership and at least one completed set.
- `COMPLETED` should be terminal except explicit metadata correction; transition enforcement on every mutation should be added during hardening.
- A plan-started workout stores `sourceWorkoutPlanId` and copies the current prescription into workout exercises/sets.

### 7.3 Workout Plan visibility

A member may read/start/duplicate a plan only when either condition is true:

1. `userId` equals the authenticated member and `isBuiltIn` is false; or
2. `userId` is null, `isBuiltIn` is true, the plan is active, and it is not archived.

A null owner alone never grants visibility.

### 7.4 Authorization invariants

- Never authorize a member-owned operation from a client-supplied user ID.
- Every workout/workout-exercise read or mutation must include or verify the authenticated owner.
- All administrator handlers must call `requireAdmin`; hiding admin navigation is not authorization.
- Exercise and built-in plan lifecycle changes are administrator-only.
- At least one active administrator must remain before self-deletion or access removal.
- Credentials, tokens, database URLs, and Firebase service-account data must never enter source, logs, or documentation.

## 8. Data validation summary

| Input | Current limits |
| --- | --- |
| Profile names | Required; max 80 characters each. |
| Profile body measures | Height 50–300 cm; weight 1–600 kg. |
| Weekly target | Integer 1–14. |
| Typical workout duration | Integer 1–1,440 minutes. |
| Workout name/notes | Name required and max 120; notes max 2,000. |
| Initial workout exercises | Up to 50 unique IDs; all must be active. |
| Saved sets | Up to 100; set number 1–100; every metric applicable to the exercise tracking type is required. |
| Set values | Rep-tracked sets require 1–10,000 reps; weighted sets require an entered kg value from 0–2,000; duration 0–86,400 seconds; distance 0–1,000,000 m; rest 0–7,200 seconds. |
| Exercise text | Name 120; category/muscle 80; description 2,000; instructions 5,000. |
| Plan | Name 120; description 2,000; category 80; 1–7 days/week. |
| Plan exercise | 1–100 exercises; 1–20 sets; reps 0–10,000; rest 0–7,200 seconds. |
| Analytics range | Valid ordered range no longer than 366 days. |

## 9. Visual and content system

### 9.1 Implemented foundations

- Responsive MUI theme with light/dark modes and FitWell-specific semantic tokens.
- Shared page headers, loading/error/empty states, status chips, dialogs, search, filters, cards, and image fallback behavior.
- Local asset registry for workouts, plans, exercises, equipment, and muscle groups.
- Asset generation and deterministic verification scripts.
- Seed sources for exercises and built-in workout plans.

### 9.2 Current asset evidence

`pnpm run verify:assets` passes and reports:

- 160 approved image assets; and
- image resolution coverage for 246 exercises.

No remote HTTP image dependency should be introduced without revisiting the asset and privacy policy.

## 10. Quality and operational baseline

### 10.1 Checks run on 2026-08-12

| Check | Result | Evidence |
| --- | --- | --- |
| `pnpm run lint` | Pass | ESLint completed with exit code 0. |
| `pnpm run typecheck` | Pass | TypeScript `--noEmit` completed with exit code 0. |
| `pnpm run build` | Pass | Next.js production build compiled and generated 37 static pages. |
| `pnpm run verify:assets` | Pass | 160 assets and 246 exercise resolutions verified. |
| `pnpm run test` | Fail: no test files | Vitest exits 1 because no matching test/spec files exist. |

### 10.2 What the baseline proves

- The current source is lint-clean and type-safe under the configured checks.
- The application produces a successful optimized build.
- Current asset references pass the project verifier.

### 10.3 What the baseline does not prove

- Firebase sign-up/sign-in behavior against the configured project.
- Database migrations and seeds against a fresh local PostgreSQL database.
- Member ownership isolation or administrator rejection through HTTP integration tests.
- Responsive browser behavior, keyboard flows, or screen-reader behavior.
- Correctness of analytics formulas for representative datasets.
- Error recovery under database, network, or authentication failures.

## 11. Known gaps and risks

### P0 — release blockers

1. **Automated coverage remains incomplete.** Rest-timer, live-workout lifecycle, copy, and exercise-rest behavior have focused coverage; security/ownership, broader validators, analytics, units, and asset resolution still need tests.
2. **No fresh-database acceptance evidence.** Migration, exercise seed, plan seed, and admin bootstrap must be proven from an empty local database.
3. **No authenticated end-to-end smoke result.** The core member and admin journeys have not been exercised in this audit.
4. **Cursor correctness risk.** Workout list next-cursor selection should be fixed and covered before pagination is exposed.

### P1 — functional completeness

1. Personal analytics returns more data than the UI displays and returns a hard-coded zero streak.
2. Quick entry is described as a completed/past workout but initially produces a draft; the UX must make the completion step explicit or complete it in the entry flow.
3. Entry mode `PLAN` should be accepted only through plan start, or the generic creation handler must initialize it consistently.
4. The product does not enforce a single active workout per member; choose and document whether multiple simultaneous live sessions are allowed.
5. Member restore/archive discovery and list pagination are incomplete.
6. Profile-delete API has no clearly discoverable member UI action and may be unnecessary beside account deletion.
7. Admin lists and analytics are minimal for larger datasets.

### P2 — experience and maintainability

1. API error response shapes vary (`error`, `errors`, `details`, `fieldErrors`, strings); converge on `ApiError`.
2. Client wrappers use broad assertions and several admin responses are unstructured `Record<string, number>`.
3. Analytics unit labels should honor the profile unit system.
4. Some components/routes exceed the project guide's preferred 300-line threshold or compress JSX into hard-to-maintain single lines; keep decomposition as an ongoing rule.
5. No CI workflow currently enforces the repository checks.

## 12. Delivery plan

### Milestone 0 — freeze and trace the Version 1 contract

**Objective:** Make this document the source of truth for the current Version 1 boundary.

Deliverables:

- Review and approve Version 1 goals, non-goals, actor permissions, and lifecycle diagrams.
- Decide the open product rules: one or many active workouts, quick-entry completion behavior, and whether profile-only deletion remains.
- Add a pull-request checklist that requires requirement IDs for feature or behavior changes.

Exit criteria:

- Every Version 1 change maps to a requirement ID in this document or adds a reviewed requirement.
- The three open product decisions above have explicit outcomes and corresponding acceptance criteria.

### Milestone 1 — restore automated confidence

**Objective:** Make `pnpm run test` pass with meaningful protection around the riskiest code.

Deliverables:

1. Validator unit tests for profile, workout, sets, exercise, and plan boundary values.
2. Unit tests for metric/imperial conversions, analytics date range, streak logic, and asset candidate resolution.
3. API integration tests with mocked Firebase verification and isolated Prisma/database fixtures for:
   - signed-out rejection;
   - cross-user read/update/delete rejection;
   - inactive exercise visibility;
   - private versus built-in plan visibility;
   - last-admin protection;
   - account tombstone/resync rejection;
   - valid/invalid workout transitions.
4. Regression test and fix for workout cursor pagination.

Exit criteria:

- `pnpm run test`, lint, typecheck, build, and asset verification all pass.
- No user-scoped mutation is untested for ownership.
- Every administrator API has at least one non-admin rejection test.

### Milestone 2 — finish the workout lifecycle

**Objective:** Make live, quick-entry, duplicated, and plan-based workouts behave consistently.

Deliverables:

- Enforce the approved active-workout policy.
- Restrict generic creation to supported entry modes or initialize `PLAN` correctly.
- Clarify quick-entry UX and implement the approved draft/completion behavior.
- Prevent invalid edits/transitions after completion, except explicitly permitted metadata corrections.
- Confirm add/remove/reorder/save behavior with retryable UI errors and no silent data loss.
- Maintain regression coverage for timer persistence, workout lifecycle coupling, and the accessible expiry cue.

Exit criteria:

- State-transition tests cover every allowed and rejected transition.
- A browser smoke test completes live, paused/resumed, quick-entry, duplicated, and plan-started workouts.
- Reloading during live logging preserves all successfully saved data.

### Milestone 3 — complete analytics and dashboard truthfulness

**Objective:** Ensure every displayed metric is defined, correct, unit-aware, and useful.

Deliverables:

- Extract one shared streak function for dashboard and analytics.
- Implement analytics current streak instead of returning zero.
- Add date-range controls with validation feedback.
- Present workout frequency and personal bests or remove them from the public response contract.
- Apply the profile unit system to displayed weight/volume.
- Add formula fixtures for empty, single-day, multi-week, plan, bodyweight, and incomplete-set datasets.

Exit criteria:

- Dashboard and analytics return the same streak for the same data/timezone.
- All response fields are either displayed or intentionally documented for downstream use.
- Metric definitions and date/timezone rules are documented and tested.

### Milestone 4 — complete plan and catalogue workflows

**Objective:** Make content discovery and plan lifecycle complete beyond the first result set.

Deliverables:

- Add reliable cursor pagination or explicit bounded-result UX for exercises, workouts, and admin datasets.
- Add plan filters for built-in/private, difficulty, category, featured, and archived where appropriate.
- Expose private-plan restore or remove the unsupported toggle behavior from the member contract.
- Validate minimum reps do not exceed maximum reps.
- Decide whether weight guidance and notes need first-class form controls.
- Test archived/inactive content visibility for member and administrator roles.

Exit criteria:

- A user can discover records beyond the first API page without duplication or omission.
- Archived and inactive content is visible only in intended admin/member recovery views.
- Plan prescriptions round-trip without losing fields.

### Milestone 5 — administration hardening

**Objective:** Make the admin console safe and usable with realistic local datasets.

Deliverables:

- Add server-side search, status filters, cursors, and explicit totals to user/workout/audit lists.
- Add confirmation and clear result/error states for every destructive mutation.
- Define audit retention and metadata policy; avoid secrets and sensitive payloads.
- Verify administrator self-removal, last-admin, disabled-user, and deleted-user cases.
- Either specify real admin settings or label the screen as environment information.

Exit criteria:

- Admin actions are covered by authorization and audit tests.
- Lists remain usable with at least 1,000 fixture records.
- Every destructive action is confirmed and produces an auditable result.

### Milestone 6 — accessibility, responsiveness, and release operations

**Objective:** Turn the compiling local app into a repeatable Version 1 release candidate.

Deliverables:

- Keyboard and screen-reader pass for auth, navigation, exercise picker, live sets, dialogs, and admin actions.
- Responsive pass at phone, tablet, and desktop widths in light and dark themes.
- Focus management for drawers/dialogs and live announcements for saves/timer expiry.
- Fresh local database runbook: safety assertion, migration reset, seeds, admin grant, startup.
- CI workflow for test, lint, typecheck, build, and asset verification.
- Environment-variable documentation containing names and purpose only, never values.

Exit criteria:

- No critical accessibility violations in the core journeys.
- Fresh setup succeeds from the documented commands.
- All required checks pass in CI and locally.
- The manual release checklist is signed off for visitor, member, and administrator roles.

## 13. End-to-end acceptance scenarios

### Scenario A — new member activation

1. Visitor signs up.
2. Local user sync succeeds.
3. Visitor is routed to onboarding.
4. Required profile values validate; optional values may remain empty.
5. Submission sets onboarding complete and routes to dashboard.
6. Dashboard shows safe empty states and the configured weekly target.

### Scenario B — live workout

1. Member starts a named workout with zero or more active exercises.
2. Workout is owned by the member and enters `IN_PROGRESS` with `startedAt`.
3. Member can add/reorder/remove exercises and save sets.
4. Rest timer works across navigation.
5. Completion without a completed set is rejected.
6. Completion with at least one completed set records completion time and duration.
7. Workout appears in history, dashboard totals, and analytics.

### Scenario C — plan workout

1. Member opens a visible built-in or owned plan.
2. Starting the plan copies ordered exercises and prescribed set count into a new workout.
3. New workout is `IN_PROGRESS`, `PLAN`, and references the source plan.
4. Editing/archiving another member's plan is rejected.
5. Deleting the source plan does not delete historical workout data.

### Scenario D — account deletion and tombstone

1. Member confirms deletion using the UI and API confirmation token.
2. Owned workouts, private plans, profile, and admin access are removed.
3. Local user row becomes disabled/deleted and identifying local fields are cleared.
4. Firebase identity remains untouched.
5. A later Firebase sign-in cannot recreate or reactivate the application account.
6. The final active administrator is blocked until another active admin exists.

### Scenario E — administrator content lifecycle

1. Normal member is rejected from the page and every admin API.
2. Administrator creates and edits an exercise and built-in plan.
3. Archived content disappears from member discovery.
4. Restored content becomes available again.
5. Every mutation creates an audit record with correct actor/action/entity/time.

## 14. Definition of done for a requirement

A requirement is complete only when:

- its user-visible behavior and error/empty/loading states are implemented;
- client request/response types and Axios wrapper match the API contract;
- server method, authentication, authorization, validation, ownership, and status rules are enforced;
- persistence changes include a reviewed Prisma migration and regenerated client;
- automated tests cover the success path, invalid input, signed-out access, and wrong-owner/wrong-role access where relevant;
- responsive and accessible behavior is manually verified for UI work;
- lint, tests, typecheck, build, and asset verification pass;
- this specification and user-facing documentation are updated when the contract changes.

## 15. Recommended execution order

The shortest responsible path to a Version 1 release candidate is:

1. Approve the scope and unresolved product rules in Milestone 0.
2. Complete Milestone 1 before adding new features.
3. Finish workout lifecycle and analytics correctness in Milestones 2–3.
4. Complete pagination/content recovery in Milestone 4.
5. Harden admin and release operations in Milestones 5–6.

Feature expansion beyond the stated Version 1 non-goals should begin only after the Version 1 release gates pass.
