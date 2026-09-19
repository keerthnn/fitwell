---
name: opsx-verify
description: >-
  OPSX Verify — post-review artifact ↔ implementation check before Archive.
  Agent completes verification.md with evidence; human authorizes Archive.
---

# OPSX — Verify

**Policy:** [REVIEW_GUIDE §1.5](../../../specs/review/REVIEW_GUIDE.md#15-verify-post-review-full-sdd), [changes/README](../../../specs/changes/README.md#apply--verify--archive).

## Prerequisites

- Apply complete; mapped tests run.
- Human tiered code review + fixes complete.
- PR ready for review.

## Steps (agent)

1. Open [REVIEW_GUIDE §1.5](../../../specs/review/REVIEW_GUIDE.md#15-verify-post-review-full-sdd) agent checklist.
2. Execute **every** checkbox; report pass, fail, or explicit human-owned waiver:
   - Every `tasks.md` item done or deferred with owner.
   - Mapped tests green; every `MUST NOT` has passing negative test or waiver.
   - `design.md` decisions reflected in shipped code.
   - `proposal.md` PRD delta (or **No PRD change**) matches what shipped.
   - Teach-back: summarize each shipped rule without relying only on git diff.
3. On mismatch: **inform the human** — human chooses fix **code** vs update **deltas**; re-run Verify.
4. Copy [`verification-template.md`](../../../specs/templates/verification-template.md) to
   `verification.md` in the active package and record the complete evidence set.
5. Request human verification approval and explicit Archive authorization.

Optional residual tasks: if gaps remain, list them for human decision (Spec Kit converge-style) — do not auto-append to `tasks.md` without human approval.

## Human gate

Human approval of `verification.md` and explicit Archive authorization. **Blocks Archive** until recorded.

## Done when

Verify report complete and human cursory sign-off recorded.

## Do not

- Archive before Verify sign-off.
- Treat green CI alone as Verify pass.
- Invent new requirements during Verify.
