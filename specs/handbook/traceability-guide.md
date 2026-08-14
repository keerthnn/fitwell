# Traceability guide

Authority: **Binding process**

## Required chain

```text
Requirement ID
  -> feature SDD
  -> source paths
  -> test paths and requirement-named cases
  -> verification evidence
```

## PRDs

Each binding requirement receives a stable ID. IDs are permanent and remain discoverable when requirements are retired or superseded.

## SDDs

Feature SDD frontmatter lists its `requirements`, `decisions`, `code`, and `tests`. A traceability section explains non-obvious mappings and gaps.

## Code

The SDD code map is the primary mapping to implementation. Add inline requirement comments only where a non-obvious, load-bearing constraint would otherwise be easy to remove accidentally.

## Tests

Include the requirement ID in the relevant `describe` or `it` name when a test verifies a binding requirement. Tests stay under `test cases/` and mirror the corresponding `src/` hierarchy.

## Verification

Full SDD `verification.md` records results by acceptance criterion and requirement ID. Lightweight work records verification and its documentation-sync decision in the task outcome.

## Validation

Until automated validation exists, review traceability manually. Future checks may validate unique IDs, resolvable document/file references, valid SDD requirement IDs, decision links, and requirement IDs used by tests.
