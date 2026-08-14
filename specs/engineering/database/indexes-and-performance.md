---
id: database-indexes-and-performance
title: Index and Performance Standard
status: draft
authority: engineering
requirements: []
decisions: []
code:
  - prisma/schema.prisma
tests: []
last_verified: null
---

# Indexes and performance

## Purpose

This document records why non-obvious indexes and database performance constraints exist. The schema owns index definitions; this document owns query rationale and reassessment criteria.

## Index record format

For each material index record:

- Model/table and indexed fields in order.
- Query or constraint it supports.
- Equality, range, ordering, and cardinality assumptions.
- Uniqueness semantics.
- Expected read benefit and write/storage cost.
- Evidence such as an explain plan or measured workload, when available.
- Date verified and trigger for reassessment.

## Rules

- Do not add speculative indexes without a query or invariant.
- Composite field order follows actual filter and sort behavior.
- Unique indexes are domain constraints, not performance hints.
- Indexes on low-cardinality fields need evidence or a useful composite context.
- Pagination and analytics designs document their likely scan/order behavior.
- Remove an index only after confirming no active query, constraint, or operational process depends on it.

## Performance review

Feature SDDs identify expected query shapes. Slow-query evidence, scale changes, new date ranges, and migration duration trigger review. Performance work remains Lightweight unless it changes a contract, data model, or architecture.
