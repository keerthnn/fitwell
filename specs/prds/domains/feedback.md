---
id: prd-feedback
title: Feedback
status: active
authority: binding-product
requirement_prefix: FEEDBACK
engineering:
  - specs/engineering/features/feedback.md
last_verified: 2026-08-15
---

# Feedback PRD

## Purpose

Feedback lets a signed-in member open and continue a private conversation with FitWell administrators.

## Requirements

### FEEDBACK-001 — Create conversation

A member may create feedback with one of the supported categories, a required subject up to 120 characters, and a required initial message up to 4,000 characters.

### FEEDBACK-002 — Categories

Supported categories are technical issue, account issue, workout content, suggestion, and other.

### FEEDBACK-003 — Owned list

A member may list only their feedback conversations, ordered by most recent message, and filter by search text, category, and status.

### FEEDBACK-004 — Pagination

Feedback listing accepts a page size from 1 through 100, defaults to 25, and may return a continuation cursor.

### FEEDBACK-005 — Conversation detail

A member may view an owned conversation with messages ordered from oldest to newest.

### FEEDBACK-006 — User reply

A member may reply to an owned conversation that is not closed. A user reply sets the conversation status to open and updates its most-recent-message time.

### FEEDBACK-007 — Closed conversation

A closed feedback conversation rejects additional member or administrator replies.

### FEEDBACK-008 — Deletion before support reply

A member may delete an owned conversation only while no administrator message exists. After an administrator reply, deletion is rejected.

### FEEDBACK-009 — Statuses

Feedback status is open, responded, or closed. An administrator reply sets responded; an administrator close action sets closed.

### FEEDBACK-010 — Privacy

A member must not list, view, reply to, or delete another member's feedback.

## Traceability

Implementation design is defined by the [Feedback SDD](../../engineering/features/feedback.md).
