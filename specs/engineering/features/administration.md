---
id: sdd-administration
title: Administration SDD Standard
status: draft
authority: engineering
requirements: []
decisions: []
code: []
tests: []
last_verified: null
---

# Administration SDD

## Purpose

This SDD must define the privileged application boundary, admin access lifecycle, confirmation safeguards, domain delegation, and audit behavior.

## Required design responsibilities

Define admin principal derivation; grant/remove authorization; route and UI guards; user disable/restore/delete mechanics; privileged exercise, plan, workout, feedback, and analytics operations; audit event schema; sensitive-data minimization; destructive-action confirmation; and revoked-admin behavior.

The underlying feature SDD continues to own domain invariants. This SDD owns only privileged orchestration and additional safeguards. Link every affected domain PRD/SDD, authorization model, data lifecycle, and operational recovery guidance.

## Required verification

For every action test signed-out, normal-user, authorized-admin, revoked-admin, target-not-found, self-impact, repeat action, failure, and audit-result behavior as applicable.

## Change control

All admin role, access, user lifecycle, destructive action, or audit changes require Full SDD and explicit project-owner approval.
