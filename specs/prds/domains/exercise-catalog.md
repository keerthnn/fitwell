---
id: prd-exercise-catalog
title: Exercise Catalog Requirements Standard
status: draft
authority: binding-product
requirement_prefix: EXERCISE
engineering:
  - specs/engineering/features/exercise-catalog.md
last_verified: null
---

# Exercise catalog PRD

## Purpose and boundary

This document governs how users and authorized administrators discover, understand, and select exercises. It owns catalogue outcomes and terminology, not seed-file formats, asset paths, database columns, or search algorithms.

## Required requirement areas

An active revision must define:

- Exercise identity and distinguishability.
- Browse, search, filter, and empty-result outcomes.
- Exercise detail and instruction expectations.
- Equipment, movement, muscle, and tracking terminology where product-visible.
- Active, archived, unavailable, and restored exercise behavior.
- Image or media fallback outcomes.
- Selection behavior when used by workouts or plans.
- Administrator catalogue-maintenance outcomes.

## Cross-domain responsibilities

Link Workout Engine and Workout Plans for exercise references, Administration for privileged mutation, system qualities for accessibility, and data requirements for deletion/reference integrity.

## Review rules

Requirements use `EXERCISE-NNN`. Catalogue content policy and catalogue software behavior must be distinguished explicitly.
