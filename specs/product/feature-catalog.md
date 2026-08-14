---
id: product-feature-catalog
title: FitWell Feature Catalog Standard
status: active
authority: informational
last_verified: null
---

# Feature catalog

## Purpose

The feature catalog is the product-language inventory of behavior verified as shipped. It helps readers discover capabilities without reading routes or SDDs and prevents roadmap ideas from being mistaken for existing functionality.

## Entry format

Group entries by product domain. Each entry should contain:

- Capability name.
- Actor who can use it.
- One-sentence observable outcome.
- Availability or role boundary when product-visible.
- Link to the governing PRD.
- Last verified date.

Example format:

```text
Capability: <product-language name>
Actor: <user or administrator>
Outcome: <observable result>
PRD: <relative link>
Last verified: YYYY-MM-DD
```

## Rules

- Add a capability only after implementation and verification.
- Describe outcomes, not pages, endpoints, database models, or libraries.
- Do not include planned work; that belongs in the roadmap.
- Do not duplicate acceptance criteria from PRDs.
- Remove or mark a capability retired when it is no longer shipped.
- Update `last_verified` only after checking the running behavior or adequate implementation evidence.

## Responsibilities

The author of a user-visible change reviews the catalog during documentation synchronization. The project owner resolves product naming and capability boundaries.
