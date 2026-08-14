---
id: sdd-onboarding
title: Onboarding SDD Standard
status: draft
authority: engineering
requirements: []
decisions: []
code: []
tests: []
last_verified: null
---

# Onboarding SDD

## Purpose

This SDD must define the implementation state machine that turns an authenticated but not-ready account into a usable FitWell account.

## Required design responsibilities

Define entry guards, source of completion truth, step order, validation, draft persistence, navigation, resumption, duplicate completion, redirect precedence, and behavior when profile, identity, or server state is inconsistent. Specify accessible form behavior and mobile progression.

Link the Onboarding, Authentication, and User Profiles PRDs plus routing, frontend, authorization, and data-lifecycle architecture.

## Required verification

Cover new, returning, completed, incomplete, signed-out, disabled, interrupted, duplicate-submit, invalid-input, and API-failure scenarios. Verify that client navigation cannot bypass server-required readiness.

## Change control

Onboarding is Full SDD by default because it combines identity, persistent readiness, and route access. Any completion-criterion or routing change must synchronize all three domain documents.
