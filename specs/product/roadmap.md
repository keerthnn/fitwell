---
id: product-roadmap
title: FitWell Current-State Roadmap
status: active
authority: informational
last_verified: 2026-08-15
---

# Current-state roadmap

## Purpose

This document records only the implemented and partially implemented product baseline visible in the repository. It contains no proposed future features, priority promises, or delivery dates.

## Implemented baseline

- Public landing and Firebase-backed authentication pages.
- Profile onboarding, profile editing, appearance preference, sign-out, and local account deletion.
- Exercise catalogue browsing, filtering, imagery, and start-from-exercise.
- Workout history, live workout creation, tracking-type-aware set recording, pause/resume/completion, quick entry, edit, duplication, deletion, and a persistent rest timer.
- Private and built-in workout-plan discovery, authoring, duplication, archive, and start-from-plan.
- Dashboard summaries and personal workout analytics.
- User/admin feedback conversations.
- Guarded administration for users, exercises, built-in plans, workouts, analytics, admin access, feedback, and audit logs.
- Local database migration, seeding, asset generation/verification, and local admin bootstrap scripts.

## Partially exposed or incomplete current capabilities

- Exercise API cursor pagination is not surfaced as subsequent-page loading in the member catalogue.
- Workout list cursor behavior is documented in the existing current-state audit as requiring correction before UI pagination is added.
- More than one in-progress workout is possible; the dashboard selects the most recently updated one.
- Generic workout creation accepts a plan entry mode even though plan-derived creation has a dedicated endpoint.
- Member restoration of archived private plans is supported by the API but not clearly exposed through a recovery UI.
- Workout-plan browsing is search-only and capped; category/difficulty filters and pagination are absent.
- Analytics UI does not expose all data returned by the API; current streak is returned as zero, and volume display does not adapt to profile unit preference.
- Profile-only deletion exists as an API but is not clearly exposed as a primary profile action.
- Several authenticated, provider-dependent, migration, and administrator invariants still require automated or manual verification.

## Explicitly absent

Nutrition, calorie tracking, medical/injury data, weight history, achievements, social/community features, sharing, public user-authored plans, and Firebase identity deletion are not implemented.

## Interpretation

The implemented baseline and partial capabilities above are inventory, not approval for expansion. Any new behavior must enter the normal Lightweight or Full SDD workflow and update the relevant PRDs before implementation.
