---
id: prd-dashboard
title: Dashboard
status: active
authority: binding-product
requirement_prefix: DASH
engineering:
  - specs/engineering/features/dashboard.md
last_verified: 2026-08-15
---

# Dashboard PRD

## Purpose

The dashboard summarizes the signed-in member's recent and cumulative workout activity and provides direct paths to resume or begin training.

## Requirements

### DASH-001 — Member greeting

The dashboard greets the member using profile name when available, then account display name, then a general fallback.

### DASH-002 — Weekly progress

The dashboard shows completed workouts since the start of the current week and compares them with the member's weekly workout target or the default target when no profile exists.

### DASH-003 — Streak

The dashboard shows the current consecutive-day streak calculated from days containing completed workouts.

### DASH-004 — Lifetime summary

The dashboard shows total completed workouts and total recorded workout duration for the member.

### DASH-005 — Recent workouts

The dashboard shows up to five most recent completed workouts.

### DASH-006 — Active workout

When in-progress workouts exist, the dashboard surfaces the most recently updated one for resumption.

### DASH-007 — Saved plans

The dashboard shows up to four recently updated, active, non-archived private plans belonging to the member.

### DASH-008 — Frequent exercises

The dashboard shows up to four exercises most frequently present in the member's completed workouts.

### DASH-009 — Page states

The dashboard provides loading and retryable error states and presents meaningful empty sections when the member has no matching data.

## Traceability

Implementation design is defined by the [Dashboard SDD](../../engineering/features/dashboard.md).
