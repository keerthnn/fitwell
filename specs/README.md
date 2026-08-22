# FitWell specifications

## Purpose

The specs directory is FitWell's canonical repository for durable product and engineering knowledge. It establishes what the product promises, how the system must fulfill those promises, why durable decisions were made, how high-risk changes are controlled, and how releases and recovery are performed safely.

The system follows Docs-as-Contracts: intentional changes to active requirements, designs, decisions, or procedures are incomplete until the relevant specification, implementation, tests, and verification agree.

## Start here

The current reverse-engineering outcome, verification evidence, unknowns, and manual-review list are recorded in the [Documentation Bootstrap Report](bootstrap-report.md).

Read the smallest set relevant to the task:

1. [Documentation policy](handbook/documentation-policy.md) for authority, synchronization, lifecycle, and conflict resolution.
2. [Engineering workflow](handbook/engineering-workflow.md) to select Lightweight or Full SDD.
3. [Authoring guide](handbook/authoring-guide.md) when writing or editing specifications.
4. [Traceability guide](handbook/traceability-guide.md) when mapping requirements to design, code, tests, and evidence.
5. [Review checklist](handbook/review-checklist.md) before completion.

## Documentation map

| Area | Owns | Authority |
| --- | --- | --- |
| [Handbook](handbook/README.md) | Documentation governance, workflow, writing, traceability, review | Binding process and engineering guidance |
| [Product](product/README.md) | Vision, verified feature inventory, roadmap | Informational |
| [PRDs](prds/README.md) | Observable product requirements and system qualities | Binding product when active |
| [Engineering](engineering/README.md) | Architecture, feature SDDs, APIs, data, ADRs, integrations, operations, quality | Engineering, binding engineering, decision, operational |
| [Changes](changes/README.md) | Full SDD deltas and verification history | Temporary while active; historical after Archive |
| [Templates](templates/README.md) | Required canonical and Full SDD document structure | Binding process |

## Authority and conflict

Security and user-data-isolation requirements override feature convenience. An approved active change may temporarily override only the canonical statements it explicitly names. PRDs own outcomes; engineering standards and accepted ADRs own mandatory technical constraints; feature SDDs own implementation design. Executable artifacts reveal current behavior but do not silently redefine intended behavior.

When documents or code conflict, stop, classify the drift, and resolve it according to the [documentation policy](handbook/documentation-policy.md).

## Knowledge flow

~~~text
Product direction
  -> PRDs and system qualities
  -> Architecture, feature SDDs, and ADRs
  -> Code, validators, schema, and migrations
  -> Automated and manual verification
  -> Deployment and operations
~~~

Product documents inform the chain but do not authorize implementation. Tests demonstrate selected contracts but do not create missing requirements.

## Workflow

Lightweight work uses a clear goal, relevant context, plan, tests, implementation, proportional verification, and a specification-sync decision.

Full SDD uses:

~~~text
Clarify -> Proposal -> Design -> Tasks -> Implementation -> Verification -> Archive
~~~

Clarify and Proposal remain separate artifacts. Implementation follows approved Tasks; it has no additional change document.

## Responsibilities

- The change author selects the mode, loads relevant context, maintains traceability, and synchronizes documentation.
- Reviewers check authority, placement, security/data impact, evidence, and link accuracy.
- Keerthan K, the project owner, approves Full SDD phase transitions, active PRDs/SDDs, accepted ADRs, destructive operations, and conflict resolution.
- Agents follow the same rules, do not invent unknown state, and stop for unresolved binding contradictions.

## Maintenance rules

Each fact has one authoritative home; other documents link to it. Update active contracts atomically with intentional behavior changes. Preserve stable IDs and historical decisions. Never store credentials, tokens, personal data, or secret values. Change last_verified only after comparing the document with authoritative evidence.
