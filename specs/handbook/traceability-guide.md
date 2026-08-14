# Traceability guide

Authority: **Binding process**

## Purpose

Traceability proves that a product promise has an approved design, an implementation location, verification evidence, and a maintained operational path. It also exposes requirements with no tests, code with no contract, and documents that no longer match reality.

## Traceability chain

```text
Product direction
  -> PRD requirement ID
  -> feature or architecture SDD
  -> code, validator, schema, or migration path
  -> automated test or manual scenario
  -> verification result
  -> deployment/runbook evidence when applicable
```

Product documents influence the chain but are not binding nodes. Accepted ADRs constrain one or more SDDs. System-quality requirements may have many implementing SDDs.

## PRD to SDD

Every active requirement must be implemented by at least one active SDD or explicitly marked as not yet implemented. PRDs list implementing SDDs in frontmatter. SDDs list exact requirement IDs in `requirements`.

Do not copy requirement text into the SDD. Cite the ID and explain the implementation consequence.

Example:

```text
SEC-004
  source: specs/prds/system-qualities.md
  implemented by: specs/engineering/architecture/authorization-model.md
  applied by: specs/engineering/features/workout-engine.md
```

## SDD to code

SDD frontmatter lists stable source directories or files in `code`. The Code map explains responsibilities only where paths are not self-explanatory.

Prefer the narrowest stable path that captures the design. Avoid long lists of helper files that will create maintenance churn. Do not list generated output.

Inline requirement comments are reserved for non-obvious load-bearing constraints:

```ts
// SEC-004: ownership must be enforced by the server-side query.
```

Do not annotate every function with requirement IDs.

## Code to tests

Tests live under the root `test cases/` directory and mirror `src/`. SDD frontmatter lists relevant test paths. A test that directly verifies a binding requirement includes the stable ID in its suite or case name.

```ts
describe("SEC-004 workout ownership", () => {
  it("rejects access by a different authenticated user", async () => {
    // Arrange, act, assert.
  });
});
```

Tests should cover success, boundary, validation, authorization, and failure behavior in proportion to risk. A requirement is not covered merely because a nearby test passes.

## Verification evidence

Full SDD `verification.md` maps every acceptance criterion and affected requirement to concrete evidence. Evidence may be:

- A named automated test and result.
- A repository command and result.
- A manual scenario with actor, precondition, action, and observed outcome.
- Migration output and integrity query.
- Authorized inspection of external configuration.
- Deployment and post-deployment checks.

“Works as expected” is not sufficient evidence.

## Traceability matrix

For complex changes, include a compact matrix:

| Requirement | SDD section | Code | Test/evidence | Result |
| --- | --- | --- | --- | --- |
| SEC-004 | Authorization | Server ownership query | `SEC-004 workout ownership` | Pass |

The matrix points to authoritative content; it does not duplicate it.

## Gaps

Classify missing links explicitly:

- **Unspecified behavior:** code exists without an approved requirement where one is needed.
- **Undesigned requirement:** requirement has no approved SDD.
- **Unimplemented requirement:** SDD exists but code is absent or incomplete.
- **Unverified requirement:** implementation exists without adequate evidence.
- **Stale mapping:** referenced path, test, or decision no longer represents the design.

Do not invent traceability to close a gap. Record the gap and create the appropriate work.

## Change maintenance

When moving or replacing code, update SDD path mappings. When retiring a requirement, update implementing SDDs and tests. When superseding an ADR, update every active SDD that cites it. Before Archive, verify that all new and changed links resolve.

## Automation policy

Start with manual review. Automation may later validate unique IDs, valid statuses, resolvable paths, valid requirement/ADR references, and test ID usage. Automated existence checks complement but cannot replace semantic review.
