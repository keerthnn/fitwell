# Engineering specifications

## Purpose

Engineering specifications define how FitWell fulfills active PRDs using its approved stack and operating environment. They own boundaries, invariants, contracts, decisions, failure behavior, and procedures that cannot be expressed as product outcomes alone.

## Areas and authority

- [Architecture](architecture/README.md) owns system-wide structure and trust boundaries.
- [Feature SDDs](features/README.md) own domain implementation design.
- [API](api/README.md) owns shared HTTP contracts and endpoint inventory.
- [Database](database/README.md) owns data meaning, lifecycle, performance rationale, and migration discipline.
- [Decisions](decisions/README.md) preserves durable choices among alternatives.
- [Integrations](integrations/README.md) owns externally controlled constraints.
- [Operations](operations/README.md) owns safe configuration, deployment, database, and recovery procedures.
- [Quality](quality/README.md) owns test strategy and proportional verification.

Exact current behavior remains executable in code, validators, the Prisma schema, migrations, and tests. Engineering documents explain why and how those artifacts satisfy requirements.

## Responsibilities

Feature authors update the smallest authoritative set of documents. Reviewers check upstream PRD links, downstream code/test links, and cross-domain effects. Keerthan K, the project owner, approves architecture and decision changes. No engineering document may invent external dashboard state or store secrets.
