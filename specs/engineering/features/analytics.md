---
id: sdd-analytics
title: Analytics SDD Standard
status: draft
authority: engineering
requirements: []
decisions: []
code: []
tests: []
last_verified: null
---

# Analytics SDD

## Purpose

This SDD must turn product metric definitions into deterministic, timezone-aware, unit-safe aggregation and presentation design.

## Required design responsibilities

For every metric define source records, inclusion/exclusion, grouping, time boundary, timezone, unit normalization, rounding, edits/deletions, incomplete records, and empty data. Define query/aggregation placement, performance, indexes, response shape, chart/table presentation, and recalculation/freshness behavior.

Link the Analytics PRD, Dashboard and Workout SDDs, profile unit/timezone design, database index rationale, and system data/privacy qualities.

## Required verification

Use table-driven examples for boundary dates, timezones, unit systems, partial workouts, edited/deleted records, zero data, and ownership isolation. Verify formulas independently from presentation.

## Change control

Metric definition or historical interpretation changes require Full SDD because they can silently alter previously displayed results.
