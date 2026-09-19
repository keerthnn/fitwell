# Engineering workflow

Authority: **Binding process**

## Purpose

This workflow converts an idea or defect into verified code and synchronized documentation. It limits long-running ambiguity, makes risk visible, and gives Keerthan K, the project owner, explicit control over high-impact decisions.

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

Clarify is the signed decision record before any delta file is drafted. Create `clarify.md` from the template, update it iteratively, and do not create Proposal, Design, or Tasks until every applicable Human decision is complete.

Required work:

- Preserve the feature-request input and write a one-paragraph restatement for human approval.
- Audit relevant specifications, ADR alignment, compliance, code blast radius, and blocking questions.
- Resolve each open question, or defer it with an owner and date.
- Compare genuine options; when only one path is credible, record and approve the recommendation.
- Bind the smallest shippable v1 scope, explicit non-goals, and separately requested v2 work.
- Decide whether v1 requires a PRD delta and record any accepted product tradeoff.
- Check every Human decision and add the `Clarify approved` sign-off.

Exit gate: Keerthan K, the project owner, signs the Lock it block, all applicable Human decisions are checked, material unknowns are resolved or explicitly deferred with owner and date, and the record says Proposal may begin.

### 2. Proposal

Proposal defines *what* FitWell changes without locking detailed mechanics. Create `proposal.md` only after signed Clarify and preserve its decisions without drift.

Required work:

- Define intent, v1 scope, non-goals, and separately requested v2 work.
- Repeat the upstream audit and record compliance, ADR alignment, and remaining blockers.
- State the PRD delta as stable-ID outcome requirements, or record `No PRD change` with governing links.
- Link compliance, commercial context when applicable, product orientation, and existing PRDs.
- Copy resolved questions from Clarify without changing their meaning.
- Obtain upstream review and confirmed teach-back.

Exit gate: Keerthan K, the project owner, approves the outcome and scope. An unapproved proposal does not authorize design or implementation.

### 3. Design

Design defines *how* the reviewed Proposal will be implemented on the current stack. Create `design.md` as an SDD delta, not pseudo-code, and traverse only the upstream context needed to assess the blast radius.

Required work:

- Write binding stack-specific rules, including platform wiring, data contracts, and error states where applicable.
- Name code, data, tenant, and tier boundaries explicitly.
- Confirm alignment with accepted ADRs or identify the superseding ADR to draft.
- Link vendor and deployment/flag guidance, or record `N/A` with a reason.
- Map every binding rule in Proposal and Design to a test; every `must not` requires a negative test.
- Obtain upstream review and confirmed teach-back.

Exit gate: the design is internally consistent, every acceptance criterion has an implementation and verification approach, risky unknowns are resolved, and Keerthan K, the project owner, approves it.

### 4. Tasks

Tasks turn the reviewed Design into deterministic Apply steps. Create `tasks.md`; treat it as working state and keep it current. Tasks must not introduce requirements.

Required work:

- Run Red-phase test tasks before implementation tasks and record the expected failure.
- Make every implementation step atomic and trace it to Proposal or Design.
- End with mapped verification proving all tests are green and no binding rule is untraced.
- Put migration, configuration, documentation, rollout, and recovery work under the traced Implementation or Verify checklist as applicable.
- Return to an earlier phase when execution discovers a new requirement or invalidates an approved decision.

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

Exit gate: required evidence passes, deviations are accepted or corrected, canonical documents are synchronized, and Keerthan K, the project owner, approves Archive.

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

Full SDD should not normally be downgraded after Proposal approval. If Clarify proves the work is low-risk and fully governed by existing contracts, Keerthan K, the project owner, may record that conclusion in `clarify.md`, close the unused package, and continue Lightweight.

## Completion standard

A change is complete only when code, tests, required verification, and canonical documentation agree. Passing a build alone is not completion.
