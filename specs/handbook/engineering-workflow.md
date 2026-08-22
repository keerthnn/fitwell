# Engineering workflow

Authority: **Binding process**

## Purpose

This workflow converts an idea or defect into verified code and synchronized documentation. It limits long-running ambiguity, makes risk visible, and gives the project owner explicit control over high-impact decisions.

FitWell has two operating modes. Select the mode per change, before implementation, from risk and blast radius rather than estimated line count.

## Lightweight workflow

Use Lightweight when the desired behavior is clear, the work stays within established contracts, and failure is easy to detect and reverse.

Typical examples include a regression fix that restores documented behavior, a visual or copy change, a small additive CRUD operation inside one domain, a behavior-preserving refactor, or additional tests around an existing invariant.

Lightweight is not appropriate merely because a patch is small. A one-line authorization change can require Full SDD.

### Lightweight sequence

1. **Goal:** State the problem, expected outcome, scope, and important constraints in the task plan.
2. **Context:** Read the relevant PRD, SDD, decision, code, tests, and operational guidance. Do not load unrelated specifications.
3. **Plan:** Identify implementation steps, tests, verification, and the final specification-sync decision.
4. **Test:** Reproduce the defect or express the new behavior in a focused test when practical.
5. **Implement:** Make the smallest change consistent with existing architecture.
6. **Verify:** Run checks selected from the verification matrix and exercise relevant user, role, failure, and responsive states.
7. **Synchronize:** Update affected canonical documents or record `No specification change` with a reason.

Lightweight work does not create a directory in `specs/changes/active/`. If planning reveals unresolved requirements, competing designs, or high-risk data/security effects, stop and promote the work to Full SDD.

## Full SDD workflow

Full SDD is mandatory when drift or incorrect assumptions could be expensive, unsafe, or difficult to reverse.

Strong triggers include:

- Authentication, token, session, identity, or account-lifecycle changes.
- Authorization, ownership, admin access, or cross-user data access.
- Destructive migrations, backfills, relation redesign, retention changes, or data-loss risk.
- A new module, major state machine, or behavior spanning multiple domains.
- A public or widely consumed API contract redesign.
- A new external service or a change to externally controlled configuration.
- Deployment architecture, environment separation, backup, or recovery changes.
- A durable architectural choice with credible alternatives.
- A change whose failure could expose, corrupt, or irreversibly delete user data.

The required sequence is:

```text
Clarify
  -> Proposal
  -> Design
  -> Tasks
  -> Implementation
  -> Verification
  -> Archive
```

Clarify and Proposal are separate phases and must not be merged.

## Phase transitions

### 1. Clarify

Clarify defines the problem before choosing a solution. Create `clarify.md` from the template and record evidence, actors, constraints, affected domains, unknowns, risks, and definition of done.

Required work:

- Identify the request and why it matters.
- Separate observed facts from assumptions.
- Identify potentially affected PRDs, SDDs, decisions, code, tests, data, and external state.
- List questions whose answers could change scope or architecture.
- Explain why Full SDD applies.

Exit gate: the project owner agrees the problem is understood, material unknowns are resolved or explicitly bounded, and Proposal may begin.

### 2. Proposal

Proposal defines what FitWell should change without locking detailed mechanics. Create `proposal.md` and link `clarify.md`.

Required work:

- Define outcome, scope, and non-goals.
- State requirement additions, amendments, or retirements.
- Write measurable acceptance criteria.
- Compare high-level approaches.
- Identify compatibility, security, data, operational, and rollout risk.

Exit gate: the project owner approves the outcome and scope. An unapproved proposal does not authorize design or implementation.

### 3. Design

Design defines how the approved proposal will be implemented. Create `design.md` and traverse only the upstream context needed to assess the entire blast radius.

Required work:

- Define architecture boundaries and dependency direction.
- Specify user/system flows and state transitions.
- Specify frontend, API, data, authorization, failure, observability, migration, rollout, and recovery behavior as applicable.
- Map requirements to planned tests.
- Identify decisions that deserve ADRs.
- Compare credible technical alternatives and consequences.

Exit gate: the design is internally consistent, every acceptance criterion has an implementation and verification approach, risky unknowns are resolved, and the project owner approves it.

### 4. Tasks

Tasks turn the design into deterministic execution units. Create `tasks.md`; treat it as working state and keep it current.

Required work:

- Order work by dependency.
- Separate Red-phase tests, implementation, migration/configuration, documentation synchronization, and verification.
- Make tasks small enough to verify independently.
- Include failure and rollback checks where relevant.
- Record any design discovery that requires returning to an earlier phase.

Exit gate: the task sequence covers the approved design and can be executed without inventing missing requirements.

### 5. Implementation

Implementation follows the approved design and tasks. It is a workflow phase, not an additional Markdown file.

Required work:

- Write requirement-driven tests and prove the intended Red-phase failure before implementation where practical.
- Implement in verifiable increments.
- Preserve unrelated changes and established boundaries.
- Update `tasks.md` as work completes.
- Return to Design or Proposal when evidence invalidates an assumption; do not silently diverge.

Exit gate: implementation tasks are complete, focused tests pass, and the change is ready for independent verification.

### 6. Verification

Verification demonstrates that the approved proposal and design were realized. Create `verification.md` and record evidence, not conclusions alone.

Required work:

- Map every acceptance criterion and binding requirement to evidence.
- Run proportional automated checks.
- Perform manual role, failure, responsive, migration, and environment-dependent scenarios as applicable.
- Compare implementation with the approved design and disclose deviations.
- Synchronize canonical PRDs, SDDs, ADRs, API/data documents, runbooks, and product inventory.
- Record known gaps and their disposition.

Exit gate: required evidence passes, deviations are accepted or corrected, canonical documents are synchronized, and the project owner approves Archive.

### 7. Archive

Archive preserves completed change history without leaving current truth in a temporary package.

Required work:

- Confirm no lasting requirement, design rule, decision, or procedure exists only in the change package.
- Set package status to `archived` and record the verification date.
- Move the directory from `active/` to `archive/YYYY/` without renaming it.
- Update navigation if the change is important historical context.

Archive is not permission to hide unfinished work. Unresolved critical gaps keep the change active or explicitly block completion.

## Returning to an earlier phase

Phase gates prevent error compounding; they do not prohibit learning. Return to Clarify when the problem was misunderstood, Proposal when scope or acceptance criteria change, Design when the technical approach or risk model changes, and Tasks when only execution ordering changes. Re-approve the revised artifact and update all downstream artifacts.

## Mode escalation and de-escalation

Lightweight work may be escalated at any time. Preserve useful tests and notes, create a change package, and begin Clarify with the discovered evidence.

Full SDD should not normally be downgraded after Proposal approval. If Clarify proves the work is low-risk and fully governed by existing contracts, the project owner may record that conclusion in `clarify.md`, close the unused package, and continue Lightweight.

## Completion standard

A change is complete only when code, tests, required verification, and canonical documentation agree. Passing a build alone is not completion.
