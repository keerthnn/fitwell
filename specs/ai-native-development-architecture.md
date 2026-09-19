---
kind: architecture
canonical_for: [spec-layer-model, operating-modes, authority-flow]
informed_by:
  - /AGENTS.md
  - /specs/handbook/documentation-policy.md
---

# AI-native specification-driven development architecture

## 1. Executive summary

FitWell uses a layered Docs-as-Contracts system. Product context explains direction; PRDs bind
observable outcomes; engineering specifications and ADRs bind current-stack design; code/tests are
executable artifacts; change packages control high-risk deltas; Verification records evidence; Archive
returns lasting truth to canonical documents.

The system has two modes. Lightweight is the default for clear, low-risk work and uses a
human-approved plan plus mandatory spec sync. Full SDD is mandatory when incorrect assumptions could
cause security/privacy incidents, cross-user access, data loss, hard-to-reverse architecture, or
operational failure.

## 2. Operating modes

### Lightweight

Use when the desired behavior is clear, existing contracts govern it, the blast radius is local, and
failure is easy to detect and reverse. The approved IDE/task plan is the plan of record. It includes
goal, files/boundaries, tests, verification, and canonical spec sync or `No specification change`.
No change package is created.

### Full SDD

Use for authentication/session/account lifecycle, authorization/ownership/admin gates, destructive or
complex data changes, new external services, architecture/deployment/recovery changes, cross-domain
state, and any credible user-data exposure/corruption risk.

```text
Clarify -> Proposal -> Design -> Tasks -> Red -> Implementation
        -> tiered code review -> Verification -> Archive
```

Full SDD uses `specs/changes/active/YYYY-MM-DD-slug/` with Clarify, Proposal, Design, Tasks, and
Verification. Human gates prevent phase compression. Canonical PRDs/SDDs are synchronized during
Verification and before the package moves unchanged to `changes/archive/YYYY/`.

### Mode changes

Lightweight may escalate whenever planning reveals unresolved requirements, competing designs, or
critical risk. Full SDD may downgrade only during Clarify when the owner records that existing
contracts completely govern low-risk work and closes the unused package.

## 3. Failure modes this architecture controls

### Error compounding

A mistaken request interpretation infects design, code, and tests. Ordered phase gates make the human
approve the problem before the solution and the solution before implementation.

### Context dilution

Loading every document hides the relevant rule. The traced graph and explicit links let agents load
the smallest authoritative upstream set.

### Specification gaming

Agents can write tests that merely agree with their code. Stable requirements, test mapping,
Red-phase evidence, assertion audit, adversarial cases, and post-review Verification make that harder.

### Non-deterministic environments

Firebase, Vercel, hosted PostgreSQL, and provider consoles may differ from local assumptions.
Operations/integration specs distinguish verified external state from unknown state and require
environment-specific evidence.

### Grounding and contradiction

Code, comments, and old docs may disagree. The authority model defines which layer owns which fact;
unresolved binding contradictions halt work instead of inviting plausible invention.

## 4. Layered specification model

### 4.1 Meta and agent guidance

`AGENTS.md`, `.agents/*.md`, and `.agents/skills/` tell agents how to navigate and execute. They link to
policy under `/specs`; they do not duplicate product requirements or create a second authority.

### 4.2 Product documents — orientation only

`specs/product/` owns vision, audiences, verified feature inventory, and roadmap context. Product
documents use product language and do not contain binding `must` or implementation mechanisms. A
roadmap priority does not authorize code.

### 4.3 PRDs — binding outcomes

`specs/prds/` owns stable, observable, stack-independent outcomes and cross-domain system qualities.
PRDs remain meaningful if Next.js, Firebase, or PostgreSQL changes. Active PRDs bind; drafts do not.

### 4.4 Engineering — current-stack design

`specs/engineering/` owns architecture, SDDs, API/data conventions, accepted ADRs, integrations,
operations, quality strategy, invariants, failure semantics, and recovery. Exact schema and executable
behavior remain in Prisma/code/migrations/tests; engineering docs own rationale and durable boundaries.

### 4.5 Change packages — temporary deltas

An active Full SDD package temporarily owns only the approved delta it names. Proposal carries PRD
outcomes, Design carries SDD rules, Tasks carries work, and Verification carries evidence. After
Archive, canonical documents own current truth and the package becomes historical evidence.

### 4.6 Classifying a rule

Use three questions:

1. Would a member or administrator need this outcome to use or explain FitWell correctly? Put it in a PRD.
2. Would violation be a security, privacy, data-integrity, contractual, or operational incident even
   without visible UI? Put the thin stack-independent outcome/system quality in a PRD.
3. Does the statement depend on Firebase, Next.js routes, Prisma models/transactions, MUI, files, or
   deployment mechanics? Put it in an SDD/architecture/API/data/operations document.

Examples:

| Statement | Home |
| --- | --- |
| A member cannot access another member's private workout | PRD/system quality |
| An administrator can maintain the shared exercise catalog | Domain PRD |
| API identity comes from verified Firebase credentials, never a client user ID | Authorization SDD |
| Workout-plan deletion uses a particular Prisma transaction/referential action | Feature/data SDD |
| Muscle-guided workout start is a verified shipped capability | Product feature catalog |

## 5. Dependency and traceability architecture

Each fact has one authoritative home; other nodes link to it. The normal chain is:

```text
Product context -> PRD/system quality -> SDD/ADR -> code/schema/migration
                -> automated/manual/operational evidence -> Verification
```

Frontmatter and traceability tables carry stable requirement/decision IDs and stable code/test paths.
Missing links are explicit requirement, design, implementation, verification, or stale-edge gaps.
See [Traced knowledge graph](traced-knowledge-graph.md).

## 6. Execution, documentation sync, and Git policy

### Documentation sync

Every implementation ends with one result:

- Canonical documents update with the intentional behavior/design/operational change, or
- `No specification change` records why the code restores/preserves existing contracts.

For Full SDD, do not edit canonicals opportunistically during Apply. Verification compares artifacts
to implementation and synchronizes affected canonicals before Archive.

### Git policy

| Mode | Agent commit policy |
| --- | --- |
| Full SDD / critical | Human commits after reviewing the diff unless explicitly instructing otherwise |
| Lightweight | Agent commits only with explicit session approval |
| Always | No force-push, rebase, amend, branch switch, or destructive cleanup without instruction |

## 7. Review and evidence architecture

Upstream review validates intent/design before code. The Testing Trophy concentrates evidence at real
API/auth/Prisma/component seams. Tiered code review scales with cost of failure. Post-review
Verification compares the approved artifacts with implementation, tests, manual/operational evidence,
and canonical sync. Archive is blocked by a critical gap or an unapproved material deviation.

## 8. External and operational state

Document FitWell's choice, constraint, ownership, configuration variable, failure mode, and recovery
procedure. Do not copy volatile provider schemas or secret values. Query an authorized source when
current console/deployment state matters; otherwise state that it is unknown.

## 9. Preventing drift

- Run `pnpm run specs:check` for required structure, local links, stale copied-project references, and
  `.agents/skills` manifest alignment.
- Keep stable IDs and links current when moving code/tests or superseding ADRs.
- Treat `last_verified` as evidence-backed, not a date-refresh field.
- Keep archived packages immutable and subordinate to active canonical documents.
- Review the feature catalog after verified user-visible changes.

## 10. Bootstrapping existing behavior

Backfill outside-in: vocabulary/product context, PRDs/system qualities, critical SDDs/ADRs,
API/data/integration/operations, then tests/evidence. Backfill does not create an active Full SDD
package unless it changes behavior. Unknowns remain explicit. See [Backfill guide](BACKFILL.md).

## 11. Related documents

- [Developer guide](DEVELOPER_GUIDE.md)
- [Documentation policy](handbook/documentation-policy.md)
- [Engineering workflow](handbook/engineering-workflow.md)
- [Clarify and Propose](changes/CLARIFY_AND_PROPOSE.md)
- [Review guide](review/REVIEW_GUIDE.md)
- [Testing guide](review/TESTING_GUIDE.md)
