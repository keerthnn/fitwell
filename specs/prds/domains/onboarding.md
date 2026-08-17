---
id: prd-onboarding
title: Onboarding
status: active
authority: binding-product
requirement_prefix: ONBOARD
engineering:
  - specs/engineering/features/onboarding.md
last_verified: 2026-08-15
---

# Onboarding PRD

## Purpose

Onboarding creates the first profile required for the member experience and records that initial setup is complete.

## Requirements

### ONBOARD-001 — Entry

A signed-in member whose profile setup is incomplete is routed from public/authentication entry points to onboarding.

### ONBOARD-002 — Setup form

Onboarding collects the required and optional profile fields defined by the User Profiles PRD.

### ONBOARD-003 — No duplicate profile

Onboarding must not create a second profile when the member already has one.

### ONBOARD-004 — Completion

Submitting valid onboarding data creates the member profile, marks onboarding complete, and routes the member to the dashboard.

### ONBOARD-005 — Validation failure

Invalid onboarding input remains on the onboarding experience and presents field or form feedback.

### ONBOARD-006 — Existing completed member

A member whose onboarding is already complete is not required to complete onboarding again.

### ONBOARD-007 — Signed-out access

A signed-out visitor cannot complete onboarding as a member.

## Current flow boundary

The current onboarding experience is a single profile form rather than a persisted multi-step wizard. There is no skip outcome.

## Traceability

Implementation design is defined by the [Onboarding SDD](../../engineering/features/onboarding.md).
