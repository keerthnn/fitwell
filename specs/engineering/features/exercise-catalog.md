---
id: sdd-exercise-catalog
title: Exercise Catalog SDD Standard
status: draft
authority: engineering
requirements: []
decisions: []
code: []
tests: []
last_verified: null
---

# Exercise catalog SDD

## Purpose

This SDD must define exercise identity, taxonomy, retrieval, selection, administration, assets, and reference integrity.

## Required design responsibilities

Define canonical identity and uniqueness; equipment, movement, muscle, and tracking classifications; search/filter normalization; active/archive behavior; detail contracts; image and fallback resolution; seed/update ownership; administrator mutations; and effects on workouts/plans that reference an exercise.

Link the Exercise Catalog PRD, Workout and Plan SDDs, administration SDD, database design, asset verification, and any content-governance decisions.

## Required verification

Cover search/filter combinations, empty results, unknown IDs, inactive records, media fallback, duplicate catalogue entries, admin rejection, reference preservation, and seed idempotency where applicable.

## Change control

Taxonomy, tracking-type semantics, uniqueness, archival/reference behavior, or seed migration changes require Full SDD when they can alter existing workout or plan meaning.
