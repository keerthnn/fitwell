---
id: product-feature-catalog
title: FitWell Feature Catalog
status: active
authority: informational
last_verified: 2026-08-23
---

# FitWell feature catalog

## Status definitions

- **Implemented:** repository contains the page/API/data path.
- **Partial:** a core path exists but presentation, pagination, recovery, or verification is incomplete.
- **Repository-visible only:** implementation exists, but live provider/database behavior was not verified during documentation bootstrap.

## Public and authentication

| Capability | Actor | Current outcome | Status | PRD |
| --- | --- | --- | --- | --- |
| Product landing | Visitor | Views FitWell value proposition and authentication actions | Implemented | [Authentication](../prds/domains/authentication.md) |
| Email/password registration | Visitor | Creates a Firebase session and proceeds toward application setup | Repository-visible only | [Authentication](../prds/domains/authentication.md) |
| Email/password and Google sign-in | Visitor | Establishes an authenticated Firebase session | Repository-visible only | [Authentication](../prds/domains/authentication.md) |
| Password reset | Visitor | Requests a reset email | Repository-visible only | [Authentication](../prds/domains/authentication.md) |
| Session-aware routing | Member | Routes to onboarding or dashboard according to local profile state | Implemented | [Authentication](../prds/domains/authentication.md) |

## Profile, onboarding, and settings

| Capability | Current outcome | Status | PRD |
| --- | --- | --- | --- |
| Onboarding profile | Collects identity, body metrics, units, fitness goal, experience, and training preferences | Implemented | [Onboarding](../prds/domains/onboarding.md) |
| Profile view and edit | Displays and updates the signed-in member's profile | Implemented | [User profiles](../prds/domains/user-profiles.md) |
| Metric/imperial preference | Converts displayed profile measurements while retaining metric values for persistence | Implemented | [User profiles](../prds/domains/user-profiles.md) |
| Theme preference | Supports light, dark, and system theme persisted in the browser | Implemented | [User profiles](../prds/domains/user-profiles.md) |
| Application-account deletion | Deletes local member data, leaves a disabled local tombstone, and preserves the Firebase identity | Implemented; manual verification needed | [User profiles](../prds/domains/user-profiles.md) |
| Profile-only deletion | API deletes the current profile without deleting the local user | Partial: API exists; primary UI exposure is not evident | [User profiles](../prds/domains/user-profiles.md) |

## Exercise catalog

| Capability | Current outcome | Status | PRD |
| --- | --- | --- | --- |
| Exercise browsing | Lists active exercises with image and classification data | Implemented | [Exercise catalog](../prds/domains/exercise-catalog.md) |
| Search and filtering | Filters by name, equipment, muscle/category, and movement | Implemented | [Exercise catalog](../prds/domains/exercise-catalog.md) |
| Start from exercise | Creates a live workout containing the selected exercise | Implemented; manual verification needed | [Exercise catalog](../prds/domains/exercise-catalog.md) |
| Cursor continuation | API returns a continuation cursor | Partial: member page does not expose loading subsequent pages | [Exercise catalog](../prds/domains/exercise-catalog.md) |

## Workouts and rest timer

| Capability | Current outcome | Status | PRD |
| --- | --- | --- | --- |
| Workout history | Lists the member's workouts with name/status filtering | Implemented | [Workout engine](../prds/domains/workout-engine.md) |
| Live workout creation | Starts a live workout with zero or more selected exercises | Implemented | [Workout engine](../prds/domains/workout-engine.md) |
| Live set recording | Records tracking-type-aware reps, weight, duration, distance, rest, and completion | Implemented | [Workout engine](../prds/domains/workout-engine.md) |
| Exercise editing | Adds, updates, removes, and reorders workout exercises | Implemented; reorder flow needs manual verification | [Workout engine](../prds/domains/workout-engine.md) |
| Pause and resume | Moves a live workout between in-progress and draft and coordinates the rest timer | Implemented | [Workout engine](../prds/domains/workout-engine.md) |
| Workout completion | Requires at least one completed set and records completion/duration | Implemented | [Workout engine](../prds/domains/workout-engine.md) |
| Quick entry | Creates a past quick-entry draft for later exercise/set editing and completion | Implemented | [Workout engine](../prds/domains/workout-engine.md) |
| Workout edit, duplicate, delete | Supports member-owned metadata/exercise editing, draft duplication, and deletion | Implemented | [Workout engine](../prds/domains/workout-engine.md) |
| Persistent rest timer | Starts from set/exercise actions; supports pause, resume, add time, reset, skip, expiry, and browser persistence | Implemented | [Workout engine](../prds/domains/workout-engine.md) |
| Single active workout invariant | Prevents more than one in-progress workout | Not implemented | [Workout engine](../prds/domains/workout-engine.md) |

## Workout plans

| Capability | Current outcome | Status | PRD |
| --- | --- | --- | --- |
| Plan library | Lists active built-in plans and the member's non-archived private plans | Implemented | [Workout plans](../prds/domains/workout-plans.md) |
| Private plan authoring | Creates and edits ordered exercise prescriptions | Implemented | [Workout plans](../prds/domains/workout-plans.md) |
| Plan duplication | Collects an editable copy name, then copies a visible plan into a private plan | Implemented | [Workout plans](../prds/domains/workout-plans.md) |
| Plan archive | Archives member-owned private plans | Implemented | [Workout plans](../prds/domains/workout-plans.md) |
| Private plan deletion | Permanently deletes a member-owned private plan after an irreversible-action confirmation | Implemented | [Workout plans](../prds/domains/workout-plans.md) |
| Private plan restore | API accepts restoring an archived private plan | Partial: member recovery UI is not evident | [Workout plans](../prds/domains/workout-plans.md) |
| Start from plan | Creates an in-progress workout with prescribed exercises and sets | Implemented | [Workout plans](../prds/domains/workout-plans.md) |
| Plan filtering/pagination | Rich difficulty/category filters and pagination | Not implemented; current list is search-only and capped | [Workout plans](../prds/domains/workout-plans.md) |

## Dashboard and analytics

| Capability | Current outcome | Status | PRD |
| --- | --- | --- | --- |
| Member dashboard | Shows greeting, weekly progress, streak, totals, recent workouts, active workout, private plans, and frequent exercises | Implemented | [Dashboard](../prds/domains/dashboard.md) |
| Personal analytics API | Calculates totals, volume, exercises, muscle distribution, weekday frequency, best weights, and plan usage for a date range | Implemented | [Analytics](../prds/domains/analytics.md) |
| Personal analytics UI | Shows headline totals, muscle distribution, and plan usage | Partial: frequency, best weights, range controls, and accurate streak presentation are absent |
| Admin analytics | Shows completed workouts, active users, and total duration for a date range | Implemented, intentionally minimal | [Administration](../prds/domains/administration.md) |

## Feedback

| Capability | Current outcome | Status | PRD |
| --- | --- | --- | --- |
| Submit feedback | Creates a categorized feedback conversation with an initial user message | Implemented | [Feedback](../prds/domains/feedback.md) |
| Member feedback list/detail | Lists owned conversations with filters and opens the message thread | Implemented | [Feedback](../prds/domains/feedback.md) |
| Member reply/delete | Adds a user reply to an open/responded conversation or deletes an owned conversation | Implemented | [Feedback](../prds/domains/feedback.md) |
| Admin feedback triage | Lists all conversations, views threads, replies, and closes conversations | Implemented | [Administration](../prds/domains/administration.md) |

## Administration

| Capability | Current outcome | Status | PRD |
| --- | --- | --- | --- |
| Guarded admin shell | Client guard and server authorization protect administration | Implemented | [Administration](../prds/domains/administration.md) |
| User administration | Lists/details users and disables, restores, or deletes local application data | Implemented; manual verification needed | [Administration](../prds/domains/administration.md) |
| Exercise administration | Creates, edits, archives, and restores catalogue exercises | Implemented | [Administration](../prds/domains/administration.md) |
| Built-in plan administration | Creates, edits, archives, and restores built-in plans | Implemented | [Administration](../prds/domains/administration.md) |
| Workout administration | Lists, inspects, and deletes workouts across users | Implemented | [Administration](../prds/domains/administration.md) |
| Admin access | Lists, grants, and removes administrator access while protecting the last active admin | Implemented; invariant needs test evidence | [Administration](../prds/domains/administration.md) |
| Audit log | Records sensitive administrator mutations and lists events | Implemented | [Administration](../prds/domains/administration.md) |
| Admin settings | Explains environment-managed setup | Informational only; no editable settings exist | [Administration](../prds/domains/administration.md) |

## Verification note

This catalog records repository-visible behavior. It does not assert that Firebase, Vercel, or a hosted PostgreSQL environment is currently configured.
