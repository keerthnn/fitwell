---
id: sdd-user-profiles
title: User Profiles SDD Standard
status: draft
authority: engineering
requirements: []
decisions: []
code: []
tests: []
last_verified: null
---

# User profiles SDD

## Purpose

This SDD must define profile ownership, validation, units/preferences, persistence, and lifecycle behavior while separating profile data from identity-provider state.

## Required design responsibilities

Define page and form responsibilities; request and response contracts; normalization and field validation; authoritative unit/timezone handling; create/update concurrency; missing and incomplete profile behavior; user ownership; account/profile deletion distinction; referential effects; and failure recovery.

Link the User Profiles and Onboarding PRDs, system data/security qualities, authorization model, database lifecycle, and account-related ADRs.

## Required verification

Cover authenticated ownership, invalid and boundary values, partial profiles, duplicate submission, stale updates, signed-out access, cross-user access, deletion effects, and unit/timezone display behavior.

## Change control

New personal data, deletion/retention changes, identity/profile coupling, or cross-domain profile dependencies require Full SDD and privacy/data review.
