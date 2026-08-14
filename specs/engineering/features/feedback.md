---
id: sdd-feedback
title: Feedback SDD Standard
status: draft
authority: engineering
requirements: []
decisions: []
code: []
tests: []
last_verified: null
---

# Feedback SDD

## Purpose

This SDD must define the feedback-conversation aggregate, user/admin visibility, message authorship, status transitions, ordering, deletion, and retention.

## Required design responsibilities

Define ownership and participant roles; category/subject/content validation; conversation and message ordering; open/responded/closed transition rules; reply permissions; delete/retention behavior; account lifecycle effects; notification or unread semantics if introduced; safe content handling; and administrator audit expectations.

Link the Feedback and Administration PRDs, authorization model, database lifecycle, and security/privacy qualities.

## Required verification

Cover user ownership, cross-user denial, normal-user admin denial, reply/close transition boundaries, closed-conversation behavior, missing author, deletion/retention effects, ordering ties, invalid content, and safe errors.

## Change control

Visibility, participant role, content retention, or status-machine changes require Full SDD.
