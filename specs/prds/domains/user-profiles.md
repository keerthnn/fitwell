---
id: prd-user-profiles
title: User Profiles
status: active
authority: binding-product
requirement_prefix: PROFILE
engineering:
  - specs/engineering/features/user-profiles.md
last_verified: 2026-08-15
---

# User profiles PRD

## Purpose

The profile stores the member information and training preferences used by FitWell after authentication.

## Requirements

### PROFILE-001 — One member profile

A member may have at most one FitWell profile.

### PROFILE-002 — Profile fields

A profile requires first name, last name, unit system, fitness goal, experience level, weekly workout target, and timezone. Gender, date of birth, height, current weight, typical workout duration, and preferred workout time are optional.

### PROFILE-003 — Profile validation

Names must not exceed 80 characters. Weekly workout target must be an integer from 1 through 14. Height, when supplied, must be from 50 through 300 centimeters; weight from 1 through 600 kilograms; and typical duration from 1 through 1,440 minutes.

### PROFILE-004 — View profile

A signed-in member may view their profile. When no profile exists, the member is shown an incomplete-profile outcome rather than another member's data.

### PROFILE-005 — Edit profile

A signed-in member may update their own profile and training preferences. Invalid values must be rejected with field-level feedback.

### PROFILE-006 — Unit preference

A member may choose metric or imperial display. Height and weight entered in imperial units are converted to and from the product's metric values without changing the meaning of the measurement.

### PROFILE-007 — Profile-only deletion

A signed-in member may delete the profile without deleting the local user account through the existing API capability.

### PROFILE-008 — Application-account deletion

A signed-in member may request deletion of local application data after explicit confirmation. The resulting local account remains disabled and marked deleted.

### PROFILE-009 — Theme preference

A member may select light, dark, or system appearance. The selection persists in the browser.

## Current exposure boundary

Profile-only deletion is implemented as an API operation but is not clearly exposed as a primary profile-page action.

## Traceability

Implementation design is defined by the [User Profiles SDD](../../engineering/features/user-profiles.md).
