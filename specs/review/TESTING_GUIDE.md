---
kind: testing-guide
canonical_for: [test-authoring, test-layer-selection, red-phase-evidence]
informed_by:
  - /AGENTS.md
  - /specs/review/REVIEW_GUIDE.md
  - /specs/engineering/quality/testing-strategy.md
  - /specs/engineering/quality/verification-matrix.md
---

# FitWell testing guide

Tests are executable evidence for selected contracts. They do not create product requirements and a
green suite does not replace design comparison, manual verification, or external-state evidence.

## 1. Testing Trophy for FitWell

```text
       / E2E/manual \     Few — critical member/admin journeys and external environments
      /-------------\
     /  Integration  \    Most — API/auth/Prisma and component behavior
     \---------------/
      \     Unit     /    Focused — pure transformations and validation helpers
       \-----------/
        \  Static  /      Always — TypeScript, ESLint, build, asset validation
```

Do not chase 100% line coverage. Prioritize feature and risk coverage for Firebase identity,
authorization/ownership, database-backed admin access, account lifecycle, destructive data behavior,
workout/plan integrity, migrations, and every SDD `must not`.

### 1.1 Layers

| Layer | Use for | Avoid |
| --- | --- | --- |
| Static | Type contracts, lint rules, production compilation, generated asset consistency | Product behavior claims |
| Unit (Vitest) | Pure helpers, transformations, deterministic validators | Prisma/auth flows |
| Integration (Vitest) | API/domain behavior, Firebase boundary plus authorization, Prisma lifecycle, component interactions | Reproducing a full browser/environment |
| E2E/manual | Critical journeys, responsive/keyboard behavior, deployed configuration, provider state | Exhaustive branch matrices |

Every prohibited behavior needs an automated negative test or an explicit verification gap with owner,
risk, reason, and follow-up.

## 2. Layout and runners

FitWell is a Next.js Pages Router application. Tests live under the root `test cases/` directory and
mirror the relevant `src/` area.

| Evidence | Location | Command |
| --- | --- | --- |
| Unit/component/API/Prisma Vitest | `test cases/**/*.test.ts(x)` | `pnpm run test` |
| TypeScript | repository | `pnpm run typecheck` |
| ESLint | repository | `pnpm run lint` |
| Production compilation | repository | `pnpm run build` |
| Generated exercise assets | repository | `pnpm run verify:assets` |
| Manual journey | local or authorized target environment | `pnpm run dev` plus recorded scenario |

Use the `fitness/*` alias for `src/` imports. Keep test names tied to stable requirement IDs when the
case verifies a binding contract, for example:

```ts
it("AUTHZ-001 rejects cross-member access without mutating the workout", async () => {
  // evidence for deny signal + no forbidden side effect
});
```

## 3. Spec-to-test workflow

For each changed PRD/SDD rule:

1. Read the rule, rationale, actor, state/event, and failure outcome.
2. Select the lowest layer that exercises the real boundary.
3. Write a test that fails if the protected behavior is deleted or inverted.
4. Add a negative/adversarial case for `must not`, ownership, role, disclosure, or destructive behavior.
5. Record the stable test path/name in the SDD mapping and Verification evidence.

### 3.1 Red phase

For new Full SDD behavior, run the focused test before implementation. Record command, expected
failure, actual failure, and why it proves the behavior is missing. Syntax errors, broken imports,
unavailable databases, or invalid fixtures are not meaningful Red evidence.

For backfill of existing behavior, the initial test may pass. Validate it by temporarily deleting or
inverting the relevant implementation in a controlled working tree and confirming the test fails;
restore the implementation afterward.

## 4. Negative and authorization tests

A strong negative test asserts all applicable dimensions:

1. Correct deny signal/status without sensitive disclosure.
2. No forbidden database or external side effect.
3. Ownership/role/data invariant remains intact.
4. Logs and response bodies contain no secret or private record details.

Minimum actor matrix for user-owned API behavior:

| Actor/state | Expected evidence |
| --- | --- |
| Signed out / invalid Firebase token | Rejected before data access or mutation |
| Owning member | Contracted success behavior |
| Different authenticated member | Rejected or non-disclosing not-found; no side effect |
| Normal member on admin operation | Rejected; no side effect |
| Database-authorized administrator | Only the explicitly permitted behavior succeeds |

Never authorize with a client-supplied user ID. Test that attempts to substitute another member's ID
do not change the principal derived from Firebase verification.

## 5. Fixtures and database safety

- Use unique member IDs/emails and isolated records per test.
- Model ownership through the same relationships used by production code.
- Exercise representative empty, duplicate, stale, terminal, retry, and interrupted states.
- Use a safely isolated test database for Prisma integration tests. Never truncate or seed an
  unverified remote/production database; reuse repository local-database guards.
- Verify referential actions and transactions by inspecting persisted state after both success and failure.

## 6. Mocking

- Mock Firebase Admin token verification at the boundary when testing API authorization, but assert the
  handler/domain behavior and ownership queries for real.
- Mock remote providers/network calls at their boundary and cover timeout, invalid response, and retry behavior.
- Prefer real Prisma behavior against an isolated PostgreSQL database for data invariants.
- Do not mock the handler, domain helper, Prisma operation, or component behavior the test claims to prove.
- Do not make tests depend on live Firebase, Vercel, or hosted-database state unless Verification
  explicitly targets an authorized environment and records that evidence separately.

## 7. Component and UI tests

Cover behavior rather than MUI implementation details:

- Loading, empty, error, and success states.
- Disabled/pending and duplicate-action protection.
- Keyboard-accessible controls, focus behavior, labels, and useful error text.
- Ownership/admin visibility only as presentation; server/API tests remain the authorization proof.
- Responsive layout and high-value journeys through manual/E2E evidence when jsdom cannot prove them.

## 8. AI-written test audit

Before accepting an agent-authored test:

- Read every assertion and confirm it checks the requirement, not an incidental mock call.
- Confirm fixtures actually reach the intended branch.
- Confirm failure is caused by missing/inverted behavior.
- For denial, assert no side effect and no disclosure.
- Reject snapshots or broad truthy assertions that obscure the contract.
- Apply the delete/invert heuristic: protected behavior removed means test red.

## 9. Verification command selection

Run focused tests while iterating, then the broader required matrix for the change. The normal full set is:

```bash
pnpm run lint
pnpm run test
pnpm run typecheck
pnpm run build
pnpm run verify:assets
pnpm run specs:check
```

Not every change requires every command, but Full SDD Verification must explain each omitted relevant
check and whether the omission blocks Archive. Record material warnings; do not report a command as
passing when it did not run in the stated environment.

## 10. Manual and operational evidence

Use actor, precondition, action, observed result, environment, and date. Include signed-out,
cross-member, normal-member/admin, responsive, keyboard, error, interruption, retry, and duplicate
actions as applicable. For migrations or deployments, record compatibility, affected-row/integrity
checks, stop conditions, rollback or roll-forward path, logs, and post-deploy smoke evidence without
including secrets.

## 11. Relationship to other documents

- [Review guide](REVIEW_GUIDE.md) owns gates and reviewer responsibilities.
- [Testing strategy](../engineering/quality/testing-strategy.md) owns durable quality architecture.
- [Verification matrix](../engineering/quality/verification-matrix.md) maps change types to checks.
- [Verification template](../templates/verification-template.md) records change-specific evidence.
- [Agent verification guidance](../../.agents/verification.md) is the short execution checklist.
