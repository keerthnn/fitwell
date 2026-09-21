---
id: prd-dashboard
title: Dashboard
status: active
authority: binding-product
requirement_prefix: DASH
engineering:
  - specs/engineering/features/dashboard.md
last_verified: 2026-09-21
---

# Dashboard PRD

## Purpose

The dashboard summarizes the signed-in member's recent and cumulative workout activity and provides direct paths to resume or begin training.

## Requirements

### DASH-001 — Member greeting

The dashboard greets the member using profile name when available, then account display name, then a general fallback.

### DASH-002 — Weekly progress

The dashboard shows distinct dates with at least one completed workout in the current Monday-through-Sunday week and compares them with the member's weekly workout-day target, or the default target when no profile exists. Multiple completed workouts on one date count once. Date grouping uses the member's valid profile timezone and falls back to UTC.

### DASH-003 — Streak

The dashboard shows consecutive successful weekly goals. A completed week succeeds when its distinct completed-workout dates meet the target effective for that week. The current week joins the streak immediately after reaching its target, but an incomplete current week does not break the streak carried from preceding completed weeks.

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
