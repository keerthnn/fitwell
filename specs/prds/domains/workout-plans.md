---
id: prd-workout-plans
title: Workout Plan Requirements Standard
status: draft
authority: binding-product
requirement_prefix: PLAN
engineering:
  - specs/engineering/features/workout-plans.md
last_verified: null
---

# Workout plans PRD

## Purpose and boundary

This document governs reusable intended workout structures and the outcomes of creating a performed workout from a plan. It does not own the lifecycle of the resulting workout.

## Required requirement areas

An active revision must define:

- Plan discovery, detail, creation, editing, duplication, archive, restore, and deletion outcomes.
- Distinction between platform-provided, user-owned, private, and any future shared plans.
- Exercise ordering and prescription semantics.
- Availability when referenced exercises change.
- Starting a workout from a plan and independence of later edits.
- Ownership and administrator-maintenance outcomes.
- Empty, incomplete, unavailable, and duplicate-action behavior.

## Cross-domain responsibilities

Link Exercise Catalog for exercise identity, Workout Engine for created workouts, Administration for platform-provided plans, and system qualities for ownership and data integrity.

## Review rules

Requirements use `PLAN-NNN`. Public/private boundary changes, ownership changes, and cross-domain lifecycle redesign require Full SDD.
