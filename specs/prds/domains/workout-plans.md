---
id: prd-workout-plans
title: Workout Plans
status: active
authority: binding-product
requirement_prefix: PLAN
engineering:
  - specs/engineering/features/workout-plans.md
last_verified: 2026-08-23
---

# Workout plans PRD

## Purpose

Workout plans are reusable ordered exercise prescriptions. Members can use active built-in plans or manage private plans, then materialize a visible plan as an in-progress workout.

## Requirements

### PLAN-001 — Visible plan library

A member may list active, non-archived built-in plans and their own non-archived private plans.

### PLAN-002 — Private ownership

A member must not view, update, archive, or start another member's private plan.

### PLAN-003 — Built-in visibility

A built-in plan is member-visible only when it has no member owner, is marked built-in, is active, and is not archived.

### PLAN-004 — Plan creation

A member may create a private non-built-in plan with name, optional description, difficulty, category, days per week, and 1 through 100 ordered exercise prescriptions.

### PLAN-005 — Plan validation

Plan name is required and limited to 120 characters; description to 2,000; category to 80; and days per week to an integer from 1 through 7.

### PLAN-006 — Exercise prescription

Each plan exercise references an active exercise and contains 1 through 20 sets, optional minimum/maximum repetitions, optional weight guidance, optional rest duration, optional notes, and an order.

### PLAN-007 — Rep-range consistency

When both minimum and maximum repetitions are supplied, minimum repetitions must not exceed maximum repetitions.

### PLAN-008 — Private plan update

A member may replace the details and ordered exercises of their private non-built-in plan.

### PLAN-009 — Archive and restore

A member may archive or restore their private non-built-in plan.

### PLAN-010 — Duplication

A member may duplicate a visible plan into a new private plan after accepting or editing a suggested valid copy name.

### PLAN-011 — Start workout

A member may start a visible plan as an in-progress workout. The new workout contains the plan's ordered exercises and prescribed count of incomplete sets.

### PLAN-012 — Historical independence

Changing or deleting a plan does not rewrite the exercises and sets already materialized into a workout.

### PLAN-013 — Permanent private-plan deletion

A member may permanently delete their private non-built-in plan only after an explicit confirmation that the action cannot be undone.

## Current limitations

Member plan listing is search-only and capped at 100 results. The API can restore an archived private plan, but the member UI does not clearly expose archived-plan recovery.

## Traceability

Implementation design is defined by the [Workout Plans SDD](../../engineering/features/workout-plans.md).
