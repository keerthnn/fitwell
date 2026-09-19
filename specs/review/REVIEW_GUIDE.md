---
kind: review-guide
canonical_for: [upstream-review, testing-trophy, tiered-code-review, full-sdd-verification]
informed_by:
  - /AGENTS.md
  - /specs/DEVELOPER_GUIDE.md
  - /specs/handbook/review-checklist.md
---

# FitWell review guide

Review is split because each stage catches a different failure: upstream review catches a wrong plan,
tests challenge the contract, code review catches implementation defects, and Verification proves the
reviewed artifacts agree with what will ship.

## Part 1 — Upstream review (strict)

Upstream review applies to active PRDs/SDDs, Full SDD artifacts, and Lightweight plans. The reviewer
must understand and teach back each binding statement; “LGTM” is not evidence.

### 1.1 When upstream review is required

| Artifact | Gate |
| --- | --- |
| Lightweight plan | Before code; plan includes tests, verification, and spec-sync result |
| `clarify.md` | Lock it before Proposal exists |
| `proposal.md` | Outcome/scope approval before Design is approved |
| `design.md` | Technical/test-mapping approval before Tasks/Apply |
| `tasks.md` | Deterministic Apply checklist before Red/implementation |
| PRD/SDD/ADR change | Before it becomes active or merges |
| `verification.md` | Approval and Archive authorization after code review |

### 1.2 Upstream review checklist

The agent prepares with [`opsx-propose`](../../.agents/skills/opsx-propose/SKILL.md). The reviewer checks:

- [ ] Correct authority and layer: product context, PRD outcome, SDD mechanism, ADR choice, or task.
- [ ] Every statement is precise, testable where binding, and written in FitWell vocabulary.
- [ ] Each `must not` has a planned negative test or an explicit owner/reason for a gap.
- [ ] Relevant PRDs, system qualities, SDDs, ADRs, API/data/integration/runbooks, and code are linked.
- [ ] Security/privacy/data conflicts are absent; unresolved binding conflict halts the change.
- [ ] The requirement is defined once; downstream documents link rather than duplicate authority.
- [ ] Stable IDs, frontmatter, links, and lifecycle status follow
      [Spec authoring](../engineering/spec-authoring.md).
- [ ] The test mapping covers success, failure, unauthorized/cross-user, duplicate/retry, and
      interruption states when applicable.
- [ ] The reviewer can teach back the rule, rationale, failure outcome, and evidence path.

#### 1.2.0 Clarify (`clarify.md`)

Use [Clarify template](../templates/clarify-template.md) and
[Clarify/Propose policy](../changes/CLARIFY_AND_PROPOSE.md).

- [ ] Request and restatement agree, or the accepted adjustment is explicit.
- [ ] Upstream audit, ADR alignment, blast radius, security/privacy/data, and external unknowns are recorded.
- [ ] No blocking question is open; deferrals have owner and date.
- [ ] A real option is chosen, or the single credible recommendation is accepted.
- [ ] v1, non-goals, and v2 are explicit; v2 does not leak into v1.
- [ ] PRD delta versus `No PRD change` is confirmed.
- [ ] Tradeoffs are accepted and every Human decision plus Lock it is signed.
- [ ] Proposal, Design, Tasks, and Verification were not created prematurely.

#### 1.2.1 Proposal (`proposal.md`)

Use [Proposal template](../templates/proposal-template.md).

- [ ] Intent, v1, non-goals, v2, and resolved questions match signed Clarify.
- [ ] PRD delta uses stable, observable, stack-independent outcomes, or cites governing PRDs under
      `No PRD change`.
- [ ] Acceptance examples cover important boundaries and failures.
- [ ] No implementation mechanism or new decision is smuggled into Proposal.
- [ ] Human upstream review and outcome teach-back are recorded.

#### 1.2.2 Design (`design.md`)

Use [Design template](../templates/design-template.md).

- [ ] Design translates reviewed Proposal without changing scope.
- [ ] Boundaries, invariants, Firebase identity, authorization/ownership/admin rules, API errors,
      Prisma transactions/referential effects, failure/retry behavior, and external state are covered as applicable.
- [ ] Accepted ADRs are followed or a superseding ADR is explicitly planned.
- [ ] Every binding Proposal/Design rule maps to evidence; every prohibition maps to a negative test.
- [ ] Rollout, compatibility, migration, recovery, and observability are addressed or justified N/A.
- [ ] Human technical teach-back and approval are recorded.

#### 1.2.3 Tasks (`tasks.md`)

Use [Tasks template](../templates/tasks-template.md).

- [ ] Red-phase test tasks precede production implementation.
- [ ] Every step is atomic, ordered, checkable, and cites Proposal or Design.
- [ ] No task introduces a new requirement, scope item, or architectural decision.
- [ ] Verification, documentation sync, rollout/recovery, and package completion work are present.

### 1.3 Plan Mode review (Lightweight only)

- [ ] The mode remains appropriate after context review.
- [ ] Goal, scope, boundaries, files, and important risks are stated.
- [ ] Test and verification approach is proportional to the cost of failure.
- [ ] The final step names canonical docs to update or records `No specification change` with reason.
- [ ] Human approval exists before code.

### 1.4 Upstream sign-off

Record reviewer, date, scope, and `Teach-back: confirmed` in the plan, artifact footer, or PR.

### 1.5 Verify (post-review, Full SDD)

After Apply and tiered code-review fixes, use
[`opsx-verify`](../../.agents/skills/opsx-verify/SKILL.md) and complete
[Verification template](../templates/verification-template.md).

- [ ] Every task is complete or deferred with owner and approved disposition.
- [ ] Every changed requirement/criterion maps to concrete passing evidence.
- [ ] Red-phase failure proved missing behavior rather than a broken harness.
- [ ] Required static, unit, integration, build, asset, and manual checks ran; omissions are explained.
- [ ] Adversarial auth/ownership/admin and no-forbidden-side-effect cases pass where applicable.
- [ ] Data migration/integrity/recovery and external/deployment evidence are recorded where applicable.
- [ ] Implementation matches Proposal and Design; every deviation has risk, approval, and canonical impact.
- [ ] PRDs, SDDs, ADRs, API/data/integration/operations/quality docs, and product inventory are synchronized.
- [ ] No current rule remains only in the package and no critical gap remains.

The project owner approves `verification.md` and explicitly authorizes Archive. Green CI alone does
not satisfy this gate. A mismatch returns to the owning artifact or code and Verification is rerun.

## Part 2 — Testing Trophy (Full SDD)

Use static checks broadly, many integration tests at API/database/component seams, focused unit tests
for pure logic, and a small number of end-to-end/manual journey checks. Details are canonical in
[Testing guide](TESTING_GUIDE.md).

### 2.1 Mocking

Mock Firebase Admin and external networks at their boundary. Do not mock the API handler/domain helper
or Prisma behavior the test claims to prove. Prefer a safely isolated real PostgreSQL database for
integration behavior when available.

### 2.2 Validating AI-written tests

Inspect assertions, not only green output. Use the delete/invert implementation heuristic: if removing
or reversing the protected behavior leaves the test green, the test is not evidence. Negative tests
assert both the deny signal and absence of forbidden side effects or disclosure.

### 2.3 Test-first sequence (Full SDD)

Design test mapping -> Tasks Red entries -> failing focused tests -> human assertion audit -> Apply ->
green focused tests -> broader checks -> tiered review -> Verification evidence.

## Part 3 — Code review (tiered by cost of failure)

### 3.1 Review tiers

| Tier | Typical work | Required depth |
| --- | --- | --- |
| Low | Copy, styles, isolated refactor | Focused diff/readability, lint/typecheck, targeted scenario |
| Medium | Feature UI, ordinary API/CRUD inside established contracts | Independent logic review, relevant tests, API/error/state checks |
| High | Auth, ownership/admin, account lifecycle, destructive data, migrations, cross-domain state, external service, deployment/recovery | Independent threat/data-failure review, adversarial tests, migration/recovery evidence, complete Full SDD traceability |

Critical-area involvement automatically bumps the change to High regardless of patch size.

### 3.2 What each tier means in practice

- Low: confirm scope, no accidental contract change, accessible/responsive UI where relevant, and
  `No specification change` is justified when claimed.
- Medium: inspect validation, error mapping, loading/empty/error/success states, repeated actions,
  transaction boundaries, and test quality.
- High: independently reconstruct identity/resource/role trust boundaries; check cross-user and
  signed-out behavior; inspect disclosure and logs; analyze partial failure, rollback, compatibility,
  backfill, stop conditions, and recovery.

### 3.3 Code review checklist

- [ ] Diff implements approved scope without hidden v2 work or unrelated rewrites.
- [ ] Every user-scoped API derives identity through `getUserIdOrSetError`; admin routes use `requireAdmin`.
- [ ] Client-supplied user IDs never authorize user-owned data; errors do not disclose private existence.
- [ ] Shared Prisma and Axios conventions are followed; validation and response types stay aligned.
- [ ] Data invariants, referential actions, indexes, transactions, idempotency, and retry behavior are sound.
- [ ] UI covers loading, empty, error, success, keyboard, and responsive states as applicable.
- [ ] Sensitive values and personal data are absent from code, docs, logs, and snapshots.
- [ ] Tests would fail if the protected implementation were deleted or inverted.
- [ ] Required commands and manual scenarios are recorded, including warnings/omissions.
- [ ] Documentation-sync result is correct and links resolve.

### 3.4 Critical-area bump

Auth, authorization/ownership, admin gates, destructive/complex migrations, account lifecycle,
external configuration, deployment/recovery, and user-data exposure/corruption always use High review.

### 3.5 Code review sign-off

Record reviewer, date, tier, checks performed, unresolved findings, and whether Verification may begin.

## Part 4 — Relationship of the gates

```text
Upstream review asks: Are we building the right contract and design?
Testing asks: Can the important rule be falsified?
Code review asks: Is the implementation safe and maintainable?
Verification asks: Did the reviewed artifacts become the shipped system, with evidence?
Archive asks: Is current truth now in canonical documents rather than temporary deltas?
```

## Maintenance

Update this guide when review gates or responsibilities change. Stack/test-runner details belong in
the Testing guide and repository guidance; product requirements belong in PRDs.
