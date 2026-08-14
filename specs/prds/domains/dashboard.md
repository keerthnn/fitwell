---
id: prd-dashboard
title: Dashboard Requirements Standard
status: draft
authority: binding-product
requirement_prefix: DASH
engineering:
  - specs/engineering/features/dashboard.md
last_verified: null
---

# Dashboard PRD

## Purpose and boundary

This document governs the user's summary and navigation experience. It owns which product questions the dashboard answers and how stale, absent, or failed summary data is communicated; metric definitions remain in Analytics.

## Required requirement areas

An active revision must define:

- Eligible actors and entry outcomes.
- Summary concepts and their product meaning.
- Recent, upcoming, or actionable information where applicable.
- Empty, first-use, loading, partial-data, and error states.
- Refresh and recency communication.
- Navigation actions and safe fallbacks.
- Mobile information priority and accessible presentation.

## Cross-domain responsibilities

Link Analytics for metric definitions, Workouts and Plans for source concepts, Onboarding for readiness, and system qualities for accessibility and data isolation.

## Review rules

Requirements use `DASH-NNN`. Do not duplicate analytics formulas or promise real-time behavior without a measurable recency contract.
