---
id: quality-testing-strategy
title: Testing Strategy
status: active
authority: engineering
last_verified: null
---

# Testing strategy

## Purpose

Testing provides fast, layered evidence that product requirements and engineering invariants hold.

## Test layers

- **Pure unit tests:** validators, transformations, time/unit logic, state transitions, and domain helpers.
- **API/integration tests:** method, input, identity, role/ownership, persistence, transactions, status, and failure translation.
- **Component tests:** user interaction, forms, loading/empty/error/success states, accessibility, and navigation intent.
- **End-to-end/manual scenarios:** provider, cookie, deployment, responsive, and multi-component flows not credibly proven in isolation.
- **Operational verification:** migrations, configuration, deployment, integrity queries, and recovery evidence.

## Rules

- Tests live under `test cases/` and mirror `src/`.
- Test observable behavior and invariants, not private implementation steps.
- Direct requirement tests include stable IDs in names.
- High-risk authorization tests are adversarial.
- Full SDD writes requirement-driven tests before implementation and demonstrates the intended Red-phase failure where practical.
- Deterministic tests control time, timezone, randomness, and external boundaries.
- Mocks preserve the contract of the boundary they replace; excessive mocking that removes the risk is not evidence.
- Flaky tests are defects; repeated retries do not establish correctness.

## Coverage strategy

Prioritize security, ownership, state transitions, data loss, validation boundaries, analytics/time logic, and destructive actions. Line coverage may identify gaps but is not a quality target by itself.

## Maintenance

Update tests with intentional contract changes. A bug fix adds regression evidence. Remove obsolete tests only after the requirement is retired or replacement coverage is demonstrated.
