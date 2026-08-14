---
id: prd-workout-engine
title: Workout Engine Requirements Standard
status: draft
authority: binding-product
requirement_prefix: WORKOUT
engineering:
  - specs/engineering/features/workout-engine.md
last_verified: null
---

# Workout engine PRD

## Purpose and boundary

This document governs recording and managing performed workouts, exercises, sets, timing, notes, and lifecycle states. It owns observable workout behavior, not reusable plan definition or analytics aggregation.

## Required requirement areas

An active revision must define:

- Creation modes and initial state.
- Valid workout lifecycle transitions and terminal behavior.
- Exercise addition, update, reorder, and removal.
- Set tracking across supported measurement types and units.
- Save, pause, resume, complete, edit, duplicate, and delete outcomes.
- Rest-timer behavior where it affects the user contract.
- Partial save, retry, duplicate action, stale state, and interruption behavior.
- Ownership, historical integrity, and date/time interpretation.

## Cross-domain responsibilities

Link Exercise Catalog for selectable exercises, Workout Plans for plan-derived workouts, Analytics for downstream metrics, and system qualities for ownership and data durability.

## Review rules

Requirements use `WORKOUT-NNN`. State-machine redesign, data-loss risk, or lifecycle changes require Full SDD.
