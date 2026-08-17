---
id: prd-analytics
title: Analytics
status: active
authority: binding-product
requirement_prefix: ANALYTICS
engineering:
  - specs/engineering/features/analytics.md
last_verified: 2026-08-15
---

# Analytics PRD

## Purpose

Personal analytics summarizes the signed-in member's completed workouts over a bounded date range.

## Requirements

### ANALYTICS-001 — Default range

Without a custom range, personal analytics covers completed workouts from the preceding 30 days through the current time.

### ANALYTICS-002 — Custom range

A custom range must contain valid ordered dates and must not exceed 366 days.

### ANALYTICS-003 — Ownership

Personal analytics includes only workouts owned by the signed-in member.

### ANALYTICS-004 — Headline totals

Analytics reports completed workout count, recorded or derived duration, total lifted volume in kilograms, and the number of workout-exercise entries.

### ANALYTICS-005 — Muscle distribution

Analytics reports exercise occurrence counts grouped by primary muscle.

### ANALYTICS-006 — Workout frequency

Analytics reports completed-workout counts grouped by weekday.

### ANALYTICS-007 — Personal best weights

Analytics reports the highest completed-set weight for each exercise where a weight exists.

### ANALYTICS-008 — Plan usage

Analytics reports completed-workout counts grouped by source workout plan.

### ANALYTICS-009 — Empty analytics

When no completed workouts fall in the range, analytics returns zero headline totals and empty breakdown collections.

## Current presentation boundaries

The API returns frequency and personal-best collections, but the current member page presents headline totals, muscle distribution, and plan usage only. The API's current-streak field is always zero. Volume is presented in kilograms regardless of profile unit preference.

## Traceability

Implementation design is defined by the [Analytics SDD](../../engineering/features/analytics.md).
