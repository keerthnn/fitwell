---
id: product-brief
title: FitWell Product Brief
status: active
authority: informational
last_verified: 2026-08-15
---

# FitWell product brief

## Product purpose

FitWell is a workout-tracking application for people who want to plan training, record performed workouts, and review workout-focused progress in one place. It provides a shared exercise catalogue, reusable workout plans, live and retrospective workout entry, personal summaries, and an administration surface for maintaining application data.

## Primary actors

| Actor | Product goal | Access boundary |
| --- | --- | --- |
| Visitor | Understand FitWell, create an account, sign in, or request password recovery | Landing and authentication pages |
| Member | Complete a fitness profile, browse exercises and plans, record workouts, and review personal activity | Their own application data plus active built-in content |
| Administrator | Maintain shared exercises and built-in plans, administer local users and workouts, manage admin access, reply to feedback, and inspect audit records | Explicit administrator access |

## Primary journeys

1. A visitor creates or accesses an account with email/password or Google authentication.
2. A new member completes onboarding with identity, fitness, unit, and training preferences.
3. A member browses and filters the exercise catalogue.
4. A member starts an empty or preselected live workout, records sets, uses the rest timer, pauses/resumes, and completes the session.
5. A member records a past workout through quick entry and edits its exercises and sets.
6. A member creates, edits, duplicates, archives, and starts a private workout plan.
7. A member starts a workout from an active built-in plan.
8. A member reviews dashboard summaries and workout analytics.
9. A member submits feedback and continues the conversation with administrators.
10. An administrator manages users, catalogue data, built-in plans, workouts, feedback, access, and audit history.

## Product principles evident in the implementation

- **Private by default:** member workouts, profiles, feedback, and private plans are scoped to the authenticated member.
- **Workout focused:** the product records workouts, exercises, sets, plans, and workout-derived analytics rather than general health data.
- **Explicit lifecycle actions:** completing, pausing, duplicating, archiving, restoring, disabling, closing, and deleting are distinct actions.
- **Responsive operation:** public, member, and administrator shells include desktop and mobile navigation.
- **Local application account control:** application data can be deleted while the external authentication identity is preserved.
- **Truthful administration:** the administrator settings page is informational rather than presenting controls that are not persisted.

## Current product boundaries

The repository does not implement nutrition or calorie tracking, injury or medical records, weight history, achievements, social/community features, sharing, or public user-authored workout plans. It does not delete Firebase Authentication identities when local application accounts are deleted.

## Product stage

The repository describes a Version 1 workout tracker with implemented end-to-end pages and API handlers. Several capabilities remain partial or require manual environment verification, particularly authenticated browser flows, analytics presentation completeness, pagination exposure, and some recovery paths. Those limitations are cataloged in the [feature catalog](feature-catalog.md) and domain PRDs.

## Evidence

This brief is derived from the route inventory under `src/pages/`, reusable UI under `src/components/`, client contracts under `src/utils/`, API handlers under `src/pages/api/`, and the Prisma model. It makes no claim about hosted configuration or production readiness.
