# Change packages

This area is used only for Full SDD work. Lightweight work does not create a change package.

## Required sequence

```text
Clarify
  -> Proposal
  -> Design
  -> Tasks
  -> Verification
  -> Archive
```

## Active package layout

```text
active/YYYY-MM-DD-semantic-change-name/
├── clarify.md
├── proposal.md
├── design.md
├── tasks.md
└── verification.md
```

Create each artifact from its matching file in [templates](../templates/README.md). Do not merge Clarify and Proposal and do not skip phases silently.

## Canonical synchronization

Before Archive:

1. Update affected PRDs, SDDs, API/database documents, decisions, and runbooks.
2. Confirm no lasting rule exists only in the change package.
3. Complete verification evidence and record known gaps.
4. Set the change status to `archived`.
5. Move the complete directory to `archive/YYYY/` without changing its original name.

Archived packages are historical evidence, not the canonical source of current behavior.
