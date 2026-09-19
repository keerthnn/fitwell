---
kind: developer-guide
canonical_for: [developer-onboarding, workflow-navigation, opsx-procedure]
informed_by:
  - /AGENTS.md
  - /specs/handbook/engineering-workflow.md
  - /specs/handbook/documentation-policy.md
see_also:
  - /specs/traced-knowledge-graph.md
  - /specs/changes/CLARIFY_AND_PROPOSE.md
  - /specs/review/REVIEW_GUIDE.md
  - /specs/review/TESTING_GUIDE.md
---

# FitWell developer guide

This is the linear entry point for humans and agents. It is canonical for choosing a workflow and
moving a change from request to completion. Detailed policy stays in `/specs`; OPSX skills under
`.agents/skills/` execute that policy but do not replace it.

## 1. Choose the operating mode

Choose before implementation. Risk and uncertainty matter more than patch size.

| Signal | Mode |
| --- | --- |
| Copy/UI polish, local refactor, regression to an existing contract, low-risk additive CRUD | **Lightweight** |
| Auth, ownership, admin access, account lifecycle, destructive migration, new external service, architecture change, cross-domain state, user-data loss/exposure risk | **Full SDD** |
| Low-stakes but uncertain | Start **Lightweight** and escalate when planning uncovers unresolved requirements or material risk |

The complete classifier is in [Engineering workflow](handbook/engineering-workflow.md).

## 2. Read the smallest authoritative context

| Question | Canonical source |
| --- | --- |
| Why does FitWell exist and what is shipped? | [Product](product/README.md), informational only |
| What observable outcome is required? | [PRDs](prds/README.md), binding product contracts |
| How is it implemented? | [Engineering](engineering/README.md), SDDs/architecture/ADRs |
| How do documents outrank or synchronize? | [Documentation policy](handbook/documentation-policy.md) |
| How do requirement, design, code, test, and evidence connect? | [Traced knowledge graph](traced-knowledge-graph.md) |
| How are specs written? | [Spec authoring](engineering/spec-authoring.md) |
| How is work reviewed and tested? | [Review guide](review/REVIEW_GUIDE.md) and [Testing guide](review/TESTING_GUIDE.md) |

Follow explicit upstream links from the affected PRD/SDD. Load adjacent documents only when the
blast radius requires them.

## 3. Lightweight path (default)

Use [`lightweight-plan-archive`](../.agents/skills/lightweight-plan-archive/SKILL.md).

```text
Goal -> relevant context -> human-approved plan -> tests/code -> tiered review
     -> proportional verification -> spec sync or “No specification change”
```

The plan of record is the approved task/Plan Mode plan, not a committed change package. It must state:

1. Goal, scope, constraints, and files/boundaries likely to change.
2. Test and verification approach selected by risk.
3. Archive/spec-sync outcome: named canonical documents to update, or an explicit
   `No specification change` with reason.

No code begins before plan approval. Lightweight work never creates a Full SDD package. If new
product decisions, competing designs, or critical risk appear, stop and promote the work to Full SDD.

## 4. Full SDD path

One package lives at `specs/changes/active/YYYY-MM-DD-semantic-change-name/` and uses
[the repository templates](templates/README.md).

```text
Clarify -> Proposal -> Design -> Tasks -> Red -> Implementation
        -> tiered code review -> Verification -> Archive
```

### 4.1 Clarify

Use [`opsx-clarify`](../.agents/skills/opsx-clarify/SKILL.md). Create only `clarify.md`. Preserve the
request, restate the intended outcome, audit upstream contracts/ADRs/security/data/external state,
expose real options, split v1/v2, decide whether a PRD delta is needed, and record tradeoffs. The
project owner signs **Lock it**. Proposal, Design, Tasks, and Verification do not exist before this gate.

### 4.2 Proposal

Use [`opsx-propose`](../.agents/skills/opsx-propose/SKILL.md). Proposal owns *what*: intent,
v1/non-goals/v2, acceptance outcomes, and a PRD delta with stable IDs or `No PRD change`. It
translates signed Clarify decisions but cannot introduce new ones. Human upstream review and
teach-back block Design approval.

### 4.3 Design

Design owns *how*: stack-specific boundaries, invariants, API/data/auth/error semantics, ADR
alignment, operations, rollout/recovery, and a test mapping for every binding rule. Every `must not`
needs a negative test. Human upstream review and teach-back block Tasks/Apply.

### 4.4 Tasks and Red

Tasks own *do*: ordered, atomic steps traced to Proposal or Design. Red-phase tests come first. Use
[`opsx-red`](../.agents/skills/opsx-red/SKILL.md) to prove they fail for the missing behavior—not
syntax, fixture, or environment errors—and have assertions audited before production code.

### 4.5 Apply and code review

Use [`opsx-apply`](../.agents/skills/opsx-apply/SKILL.md). Execute the approved tasks without
inventing requirements or weakening tests. Then perform tiered code review from
[Review guide Part 3](review/REVIEW_GUIDE.md#part-3--code-review-tiered-by-cost-of-failure).
Critical areas receive the highest relevant tier.

### 4.6 Verification

Use [`opsx-verify`](../.agents/skills/opsx-verify/SKILL.md) after review fixes. Create
`verification.md`: acceptance and Red evidence, automated checks, manual/adversarial scenarios,
security/data/deployment evidence, design deviations, known gaps, and canonical-document sync. Green
CI alone is not verification. The project owner approves Verification and authorizes Archive.

### 4.7 Archive

Use [`opsx-archive`](../.agents/skills/opsx-archive/SKILL.md). Fold lasting outcomes into PRDs,
technical rules into SDDs/architecture/ADRs/runbooks, and verified user-visible changes into the
feature catalog. No current rule may remain only in the temporary package. Mark it archived and move
the unchanged directory to `specs/changes/archive/YYYY/<original-directory-name>/`.

## 5. Review gates

| Gate | Human verifies | Blocks |
| --- | --- | --- |
| Mode/plan | Correct mode, scope, tests, spec-sync decision | Lightweight implementation |
| Clarify Lock | Decisions, audit, v1/non-goals/v2, PRD decision | Proposal |
| Proposal review | Matches Clarify; outcome teach-back; PRD delta/waiver | Design approval |
| Design review | Boundaries, failures/security/data, test mapping | Tasks/Apply |
| Red audit | Assertions fail for the intended missing behavior | Implementation |
| Code review | Tiered implementation review and fixes | Verification |
| Verification approval | Artifact ↔ implementation evidence and synchronized canonicals | Archive |

## 6. Layer rules

- Product documents orient; they do not contain binding `must`/`must not` requirements.
- PRDs own stable, observable, stack-independent outcomes.
- SDDs and ADRs own stack-specific policy, boundaries, invariants, and durable choices.
- Active change packages temporarily own approved deltas; canonicals own current truth after Archive.
- Code and tests are executable evidence, not permission to silently redefine a contract.
- When binding documents conflict materially, stop and ask the project owner.

## 7. Agent skills and implementation guidance

All FitWell workflow skills live under `.agents/skills/`; this is the only supported skill root.

| Phase | Skill |
| --- | --- |
| Choose mode | [`opsx-mode`](../.agents/skills/opsx-mode/SKILL.md) |
| Lightweight | [`lightweight-plan-archive`](../.agents/skills/lightweight-plan-archive/SKILL.md) |
| Clarify | [`opsx-clarify`](../.agents/skills/opsx-clarify/SKILL.md) |
| Propose | [`opsx-propose`](../.agents/skills/opsx-propose/SKILL.md) |
| Red | [`opsx-red`](../.agents/skills/opsx-red/SKILL.md) |
| Apply | [`opsx-apply`](../.agents/skills/opsx-apply/SKILL.md) |
| Verify | [`opsx-verify`](../.agents/skills/opsx-verify/SKILL.md) |
| Archive | [`opsx-archive`](../.agents/skills/opsx-archive/SKILL.md) |

Manifest: [`.agents/skills/opsx/_manifest.yaml`](../.agents/skills/opsx/_manifest.yaml). During Apply,
also read the relevant [frontend](../.agents/frontend.md), [API](../.agents/api.md),
[authentication](../.agents/auth.md), [data model](../.agents/data-model.md), and
[verification](../.agents/verification.md) guidance.

## 8. Completion and escalation

A change is complete only when implementation, tests, review evidence, and canonical documents agree.
Escalate when authority is unclear, binding contracts conflict, external state cannot be verified, a
destructive operation needs approval, or a critical gap remains.
