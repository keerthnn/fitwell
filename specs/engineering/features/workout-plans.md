---
id: sdd-workout-plans
title: Workout Plans SDD Standard
status: draft
authority: engineering
requirements: []
decisions: []
code: []
tests: []
last_verified: null
---

# Workout plans SDD

## Purpose

This SDD must define reusable plan ownership, exercise prescription, lifecycle, and conversion into an independent performed workout.

## Required design responsibilities

Define built-in/platform and private ownership classes; access predicates; plan/exercise aggregate boundaries; ordering and prescription fields; create/edit/duplicate/archive/restore behavior; featured/active semantics if used; unavailable exercise handling; workout creation snapshot semantics; and administrator maintenance.

Link the Plan PRD, Exercise Catalog, Workout Engine, Administration, authorization model, and database lifecycle. A null owner must never imply public access without an explicit resource-class rule.

## Required verification

Cover owner/non-owner/admin access, platform versus private plans, archive/restore, duplicate behavior, exercise ordering, missing/inactive exercises, plan-to-workout independence, and destructive-reference effects.

## Change control

Ownership class, sharing/public visibility, plan snapshot, or reference lifecycle changes require Full SDD.
