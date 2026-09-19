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

### EXERCISE-010 — Selectable body discovery

In muscle-guided discovery, the system must present a complete human-body diagram with front and back views that together allow selection and deselection of Chest, Back, Shoulders, Biceps, Triceps, Quadriceps, Hamstrings, Glutes, Calves, Abs, Traps, and Forearms. Selection must persist when the member changes body view, and selected groups must be identifiable by name.

### EXERCISE-011 — Multiple-group matching

When one or more muscle groups are selected, the system must show active exercises classified in any selected broad catalog group, including its primary-muscle subregions, with each exercise appearing once in the results. It must not infer additional matches solely from secondary-muscle involvement.

### EXERCISE-012 — Complete and refinable results

Members must be able to reach every matching active exercise across result pages. Optional name search and equipment selection must narrow the current group results, and changing discovery criteria must not mix results from different criteria.

### EXERCISE-013 — Explicit unfiltered browsing

Before muscle selection, the system must prompt for a selection and offer Browse all exercises. Clearing muscle selections must restore that prompt. Choosing Browse all must clear muscle filtering and make all active catalog groups, including Full Body and unmapped groups, reachable through browsing and name search.

### EXERCISE-014 — Discovery preserves user work

Changing muscles, equipment, body view, name search, or result page must not add or remove chosen exercises, change their order, or discard entered workout sets or plan prescriptions. Adding or removing an exercise must require the corresponding explicit member action.

### EXERCISE-015 — Recoverable discovery states

Discovery must distinguish loading, no matches, and request failure, offer retry after request failure, and prevent obsolete results from being presented as matches for the current criteria. These states must preserve chosen exercises and entered data. If the body illustration is unavailable, labeled muscle controls must remain usable.

## Current limitation

The standalone member exercise page consumes the first result page but does not expose continuation loading. Muscle-guided discovery consumes continuation pages independently.

## Traceability

Implementation design is defined by the [Exercise Catalog SDD](../../engineering/features/exercise-catalog.md).
