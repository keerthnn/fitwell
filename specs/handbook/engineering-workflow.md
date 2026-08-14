# Engineering workflow

Authority: **Binding process**

FitWell uses a lightweight workflow by default and the Full SDD workflow when the cost or risk of drift is high.

## Mode selection

Use the lightweight workflow for contained bug fixes, UI/copy changes, and additive single-domain CRUD that follows established authentication, authorization, API, and data patterns.

Use Full SDD for authentication, authorization, account lifecycle, admin access, destructive or complex migrations, new modules, cross-domain behavior, architecture changes, external services, deployment redesign, or changes that could expose or corrupt user data.

## Lightweight workflow

1. State the problem and expected outcome.
2. Read the relevant canonical documents and code.
3. Plan the implementation and verification.
4. Add a regression or behavior test where practical.
5. Implement the smallest safe change.
6. Run proportional verification from the [verification matrix](../engineering/quality/verification-matrix.md).
7. Synchronize affected canonical documentation or record `No specification change`.

Lightweight work does not create a directory under `specs/changes/active/`.

## Full SDD workflow

The required sequence is:

```text
Clarify
  -> Proposal
  -> Design
  -> Tasks
  -> Verification
  -> Archive
```

### Clarify

Create `clarify.md`. Establish the problem, context, constraints, unknowns, affected domains, risks, and definition of done. Resolve material ambiguity before Proposal.

### Proposal

Create `proposal.md`. Define the approved outcome, scope, non-goals, requirement deltas, acceptance criteria, alternatives at a high level, and mode justification. Proposal approval is required before Design.

### Design

Create `design.md`. Specify flows, contracts, data design, authorization, failure handling, migration, rollout, testing, and alternatives. Read all upstream PRDs, SDDs, decisions, operational constraints, code, and tests needed to assess blast radius.

### Tasks

Create `tasks.md`. Break the approved design into ordered, verifiable steps. Include tests, migrations, documentation synchronization, and final verification. Keep it current during implementation.

### Verification

Create `verification.md`. Record requirement coverage, commands, manual scenarios, security checks, migration results, deviations, and known gaps. A change is not verified merely because it builds.

### Archive

Update every affected canonical document, confirm no lasting rule remains only in the change package, set the package status to `archived`, and move the directory to `specs/changes/archive/YYYY/`.

## Phase discipline

Do not silently skip or merge Full SDD phases. If a phase reveals a material contradiction, return to the earlier affected artifact and obtain project-owner direction before continuing.
