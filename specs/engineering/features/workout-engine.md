---
id: sdd-workout-engine
title: Workout Engine SDD Standard
status: draft
authority: engineering
requirements: []
decisions: []
code: []
tests: []
last_verified: null
---

# Workout engine SDD

## Purpose

This SDD must define the workout aggregate, state machine, exercise/set recording, timing, mutation ordering, and historical integrity.

## Required design responsibilities

Define aggregate ownership; valid states and transitions; creation modes; exercise ordering; set identity and supported measurements; save semantics; pause/resume/complete/edit/duplicate/delete behavior; timer authority; transaction boundaries; concurrency and stale updates; unit/date normalization; plan provenance; and downstream analytics effects.

Use state diagrams for lifecycle transitions and explicitly document invalid transitions and idempotent repeats. Link the Workout PRD, Exercise and Plan SDDs, authorization model, database lifecycle, and analytics contracts.

## Required verification

Cover every state transition, invalid transition, partial save, duplicate request, ordering boundary, tracking type, ownership attack, deletion effect, and completion invariant.

## Change control

State-machine, set schema, ownership, completion, destructive mutation, or historical-integrity changes require Full SDD and migration/recovery analysis.
