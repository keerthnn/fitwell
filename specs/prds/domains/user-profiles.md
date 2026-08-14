---
id: prd-user-profiles
title: User Profile Requirements Standard
status: draft
authority: binding-product
requirement_prefix: PROFILE
engineering:
  - specs/engineering/features/user-profiles.md
last_verified: null
---

# User profiles PRD

## Purpose and boundary

This document governs user-visible profile data, preferences, profile completion, and account-level self-service outcomes. It does not own authentication credentials, workout history semantics, or administrator-only user management.

## Required requirement areas

An active revision must define:

- Profile creation, viewing, and editing outcomes.
- Required and optional user-provided fields.
- Validation and correction behavior.
- Unit, timezone, and fitness-preference outcomes.
- Incomplete-profile and missing-profile behavior.
- Profile deletion versus application-account deletion.
- Disabled or deleted account visibility and recoverability.
- Privacy expectations for profile information.

## Cross-domain responsibilities

Link Onboarding for first-run sequencing, Authentication for identity state, system qualities for privacy and data lifecycle, and Administration for privileged user actions.

## Review rules

Requirements use `PROFILE-NNN`, remain meaningful without naming database fields, and distinguish user intent from internal storage. Deletion or identity-lifecycle changes require Full SDD.
