# FitWell specifications

This directory is the canonical home for FitWell product requirements, engineering design, decisions, operations, quality standards, and change records.

## Start here

- [Documentation policy](handbook/documentation-policy.md): authority, lifecycle, and conflict rules.
- [Engineering workflow](handbook/engineering-workflow.md): lightweight and Full SDD workflows.
- [Authoring guide](handbook/authoring-guide.md): naming, metadata, and writing rules.
- [Traceability guide](handbook/traceability-guide.md): requirements-to-code-to-test mapping.
- [Review checklist](handbook/review-checklist.md): proportional review gates.

## Documentation map

| Area | Purpose | Authority |
| --- | --- | --- |
| [Product](product/README.md) | Vision, shipped-feature inventory, and roadmap | Informational |
| [PRDs](prds/README.md) | Observable product behavior and system qualities | Binding product |
| [Engineering](engineering/README.md) | Architecture, SDDs, APIs, data, decisions, integrations, operations, and quality | Engineering, binding engineering, decision, or operational |
| [Changes](changes/README.md) | Full SDD work in progress and archived evidence | Temporary until synchronized |
| [Templates](templates/README.md) | Required document structures | Binding process |

## Authority order

1. Security and user-data-isolation requirements override feature convenience.
2. An approved active change temporarily overrides the canonical documents it explicitly changes.
3. PRDs define expected observable behavior.
4. Engineering SDDs define the approved implementation design.
5. Accepted decision records define durable technical choices.
6. Code, validators, Prisma schema, migrations, and tests reveal the exact current executable state.
7. Product documents provide direction but never override binding specifications.

If executable state and a binding document disagree, treat the mismatch as drift. Determine whether the implementation or document is wrong and resolve both deliberately.

## Implementation path

```text
Product direction
  -> PRDs and system qualities
  -> Engineering SDDs and decisions
  -> Code, validators, and Prisma schema
  -> Tests and verification
  -> Deployment and operations
```

Do not duplicate authoritative details. Link to the exact source instead.
