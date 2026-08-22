# Full SDD change packages

## Purpose

This folder contains temporary design deltas and historical verification evidence for high-risk FitWell changes. It is used only for Full SDD; Lightweight work records its plan and specification-sync result without a package.

## Required workflow

```text
Clarify
  -> Proposal
  -> Design
  -> Tasks
  -> Implementation
  -> Verification
  -> Archive
```

Clarify and Proposal are separate documents. Implementation follows Tasks and has no separate Markdown artifact. The [engineering workflow](../handbook/engineering-workflow.md) defines phase responsibilities and approval gates.

## Active package

```text
active/YYYY-MM-DD-semantic-change-name/
├── clarify.md
├── proposal.md
├── design.md
├── tasks.md
└── verification.md
```

Copy each artifact from [templates](../templates/README.md). Use one shared change ID in frontmatter. The package's documents are temporary authority only after their phase approval.

## Responsibilities

The change author maintains phase artifacts and returns to an earlier phase when evidence changes scope or design. The project owner approves Clarify, Proposal, Design, Verification, and Archive. Reviewers verify traceability, risk treatment, evidence, and canonical synchronization.

## Archive gate

Before moving a package:

1. Every acceptance criterion has adequate evidence.
2. Required checks and risk-specific scenarios pass.
3. Deviations and known gaps are explicitly resolved or accepted.
4. Affected PRDs, SDDs, ADRs, API/data docs, integrations, runbooks, quality docs, and product inventory are synchronized.
5. No current rule exists only in the package.
6. The project owner authorizes Archive.

Move the entire directory unchanged to `archive/YYYY/`. Archived packages are historical evidence and never outrank active canonical documents.
