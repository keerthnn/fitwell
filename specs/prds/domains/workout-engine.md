---
id: prd-workout-engine
title: Workout Engine
status: active
authority: binding-product
requirement_prefix: WORKOUT
engineering:
  - specs/engineering/features/workout-engine.md
last_verified: 2026-08-15
---

# Workout engine PRD

## Purpose

The workout engine records performed or planned-for-entry workout sessions, their ordered exercises, and tracking-type-aware sets.

## Requirements

### WORKOUT-001 — Owned workout history

A member may list and view only their workouts, search by name, filter by status, and order the list newest or oldest.

### WORKOUT-002 — Workout creation

A member may create a workout with a required name, date, entry mode, optional duration and notes, and up to 50 unique active exercises.

### WORKOUT-003 — Live start

A live workout starts in progress and records a start time.

### WORKOUT-004 — Quick entry

Quick entry creates a draft workout for a past session. The member completes it through the normal workout lifecycle.

### WORKOUT-005 — Exercise management

A member may add an active exercise, remove an exercise, reorder all workout exercises, and update exercise notes on an owned workout.

### WORKOUT-006 — Set replacement

A member may save up to 100 sets for an owned workout exercise. Saving replaces the exercise's prior set collection as one operation.

### WORKOUT-007 — Tracking validation

A completed set must contain the values required by its exercise tracking type. Rep-tracked sets require at least one repetition; weighted sets require weight; duration-tracked sets require duration; and distance-tracked sets require distance.

### WORKOUT-008 — Set limits

Set numbers range from 1 through 100; repetitions from 0 through 10,000 before tracking completion rules; weight from 0 through 2,000 kilograms; duration from 0 through 86,400 seconds; distance from 0 through 1,000,000 meters; and rest from 0 through 7,200 seconds.

### WORKOUT-009 — Pause

An in-progress owned workout may be paused, becoming a draft. Other states cannot be paused.

### WORKOUT-010 — Resume

An owned draft may be resumed, becoming in progress and receiving a refreshed start time. Other states cannot be resumed.

### WORKOUT-011 — Completion

An owned draft or in-progress workout may be completed only when at least one set is complete. Completion records a completion time and derives duration when no duration was supplied.

### WORKOUT-012 — Rest timer

Completing a set may start the workout-scoped rest timer. The member may start, pause, resume, add 30 seconds, reset, or skip it; expiry is visibly announced.

### WORKOUT-013 — Timer persistence

Rest-timer state persists across member navigation and reload for the same signed-in member and workout. Pausing/resuming/completing the workout coordinates or clears the timer.

### WORKOUT-014 — Workout update

A member may update the name, date, duration, and notes of an owned workout within validation limits.

### WORKOUT-015 — Duplication

A member may duplicate an owned workout into a new quick-entry draft. Copied sets are not complete in the duplicate.

### WORKOUT-016 — Deletion

A member may delete an owned workout and its contained workout exercises and sets.

### WORKOUT-017 — Source-plan context

A workout created from a plan retains source-plan context while the source exists and remains usable if the source plan is later deleted.

## Current implementation boundaries

The repository does not enforce a single in-progress workout per member. Generic workout creation accepts the plan entry mode even though plan start has a dedicated flow. Completed-workout metadata updates are not globally blocked by status.

## Traceability

Implementation design is defined by the [Workout Engine SDD](../../engineering/features/workout-engine.md).
