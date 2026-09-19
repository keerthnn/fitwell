# Clarify and Propose

This guide defines decision discipline before implementation in FitWell Full SDD. It complements the
phase mechanics in [Engineering workflow](../handbook/engineering-workflow.md).

## Principle

Clarify decides; Proposal and Design translate. A downstream artifact must not introduce a product,
scope, security, data, or architectural decision that the signed upstream artifact did not settle.

## Phase A — Clarify

Create `specs/changes/active/YYYY-MM-DD-semantic-change-name/clarify.md` from the template. Do not
create Proposal, Design, Tasks, or Verification yet.

The agent records:

1. The original request and a one-paragraph restatement of the outcome to bind.
2. The smallest relevant upstream set: product context, PRDs/system qualities, SDDs, ADRs,
   API/data/integration/runbooks, code, and tests.
3. Compliance, security, and data conflicts; an unresolved binding conflict means **HALT**.
4. Blast radius and external state that is verified versus state that remains unknown.
5. Material open questions only. Resolve each, defer it with owner/date, or escalate it.
6. Genuine options with product impact, engineering cost, and risk. If one path is credible, say so.
7. v1, non-goals, and v2. Deferred work must not leak into v1 deltas or tasks.
8. PRD delta versus `No PRD change`, and accepted tradeoffs from the original request.

### Clarify human gate

The project owner reviews every Human decision and signs the Lock it block. The signature approves the
problem, approach, v1 boundary, PRD decision, and tradeoffs. It does not approve an unwritten design.

## Phase B — Propose

After Lock it, create Proposal, then Design, then Tasks from their templates.

### Proposal owns what

Proposal contains intent, v1/non-goals/v2, upstream links, resolved questions, acceptance outcomes,
and the PRD delta. Requirements are stable, observable, testable, and stack-independent. If existing
PRDs fully govern the outcome, record `No PRD change` and cite them.

### Design owns how

Design contains the SDD delta: boundaries, invariants, API/data/auth/failure behavior, ADR alignment,
operations, rollout/recovery concerns, and test mapping. It is not product rationale or pseudo-code.

### Tasks own do

Tasks are atomic, ordered, and traced to Proposal or Design. Red-phase test work precedes production
implementation. Tasks cannot add acceptance criteria, architecture choices, or scope.

### Upstream review sequence

Review Proposal, then Design, then Tasks. For Proposal and Design, the reviewer teaches each binding
rule back in plain language, checks its source decision, checks failure/negative behavior, and confirms
the downstream test mapping. A mismatch returns to Clarify or the owning artifact.

## Anti-patterns

- Clarify theater: creating every file at once and asking for one blanket approval.
- Decision smuggling: adding requirements in Design or Tasks.
- Premature canon edits: changing PRDs/SDDs during Apply instead of preserving the approved delta.
- v2 leakage: implementing deferred work without a new approval.
- Green-test substitution: treating CI as proof Proposal and Design match shipped behavior.
- Archive as storage: leaving current rules only in the historical package.

