---
id: prd-analytics
title: Analytics Requirements Standard
status: draft
authority: binding-product
requirement_prefix: ANALYTICS
engineering:
  - specs/engineering/features/analytics.md
last_verified: null
---

# Analytics PRD

## Purpose and boundary

This document governs the meaning and presentation of workout-derived metrics. It owns user-visible definitions, date-range semantics, units, and trustworthy empty/partial states, not SQL or aggregation algorithms.

## Required requirement areas

An active revision must define:

- Metric names and product-language definitions.
- Inclusion and exclusion rules expressed observably.
- Timezone, day boundary, date-range, and comparison semantics.
- Unit display and conversion expectations.
- Treatment of incomplete, deleted, edited, or duplicate source activity.
- Empty, insufficient-data, partial-data, and unavailable outcomes.
- Recency and recalculation expectations.
- Administrator analytics boundaries where applicable.

## Cross-domain responsibilities

Link Workout Engine and Dashboard for source and presentation, User Profiles for units/timezone, Administration for privileged summaries, and system qualities for privacy and integrity.

## Review rules

Requirements use `ANALYTICS-NNN`. Every metric must have examples with boundary dates and source states before activation.
