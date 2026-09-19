# Engineering handbook

## Purpose

The handbook is the binding operating manual for FitWell's documentation system. It explains how to classify information, select a workflow, author specifications, maintain traceability, and review work. It does not define feature behavior; feature behavior belongs in PRDs and SDDs.

## Reading order

1. [Documentation policy](documentation-policy.md) — authority, Docs-as-Contracts, lifecycle, synchronization, and conflict resolution.
2. [Engineering workflow](engineering-workflow.md) — Lightweight and Full SDD execution.
3. [Authoring guide](authoring-guide.md) — writing, naming, frontmatter, requirements, and cross-references.
4. [Traceability guide](traceability-guide.md) — PRD-to-SDD-to-code-to-test-to-verification mappings.
5. [Review checklist](review-checklist.md) — proportional review gates.

## Authority and responsibilities

The documentation policy, workflow, and traceability guide have **binding process** authority. The authoring guide and review checklist provide engineering guidance except where they restate a binding rule from those documents.

The change author applies the handbook. The reviewer checks compliance. Keerthan K, the project owner, approves Full SDD phase transitions and resolves conflicts. Agents must follow the same rules and must not invent missing requirements or external state.

## Maintenance

Update this handbook only when the documentation system itself changes. Feature work must link to the handbook rather than copying its process rules into individual PRDs or SDDs.
