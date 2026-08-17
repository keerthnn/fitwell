---
id: prd-exercise-catalog
title: Exercise Catalog
status: active
authority: binding-product
requirement_prefix: EXERCISE
engineering:
  - specs/engineering/features/exercise-catalog.md
last_verified: 2026-08-15
---

# Exercise catalog PRD

## Purpose

The exercise catalog lets members find active exercises and supplies the exercise definitions used by workouts and workout plans.

## Requirements

### EXERCISE-001 — Active catalog

A member may browse active exercises. Inactive exercises are not returned to a normal member.

### EXERCISE-002 — Search and filters

A member may search exercises by name and filter by category, equipment, and movement.

### EXERCISE-003 — Exercise information

An exercise may present name, description, instructions, equipment, movement, category, primary and secondary muscles, compound status, tracking type, and available image information.

### EXERCISE-004 — Tracking types

An exercise declares one of the supported tracking outcomes: repetitions and weight, repetitions only, duration, distance, or duration and distance.

### EXERCISE-005 — Stable identity

Two catalog entries may not use the same name-and-equipment combination.

### EXERCISE-006 — Start from exercise

A member may start a live workout from an active exercise, with that exercise added to the new workout.

### EXERCISE-007 — Catalog page size

Exercise listing accepts a result limit from 1 through 100 and may return a continuation cursor.

### EXERCISE-008 — Administrator visibility

An administrator may inspect inactive exercises in addition to active ones.

### EXERCISE-009 — Image fallback

When a requested exercise image is unavailable, the UI presents an approved fallback rather than a broken remote dependency.

## Current limitation

The member exercise page consumes the first result page but does not expose continuation loading.

## Traceability

Implementation design is defined by the [Exercise Catalog SDD](../../engineering/features/exercise-catalog.md).
