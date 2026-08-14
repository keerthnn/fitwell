# Review checklist

Authority: **Engineering guidance**

## Purpose

Use this checklist to review specifications and implementation proportionally. Record material findings; do not mechanically mark irrelevant items. Security, authorization, destructive data changes, and Full SDD gates are never optional when applicable.

## Change classification

- [ ] The problem and desired outcome are explicit.
- [ ] Lightweight versus Full SDD was selected from risk and blast radius.
- [ ] Full SDD triggers were not dismissed because the patch is small.
- [ ] Relevant upstream PRDs, system qualities, SDDs, ADRs, runbooks, code, tests, and external state were identified.
- [ ] Unrelated documents were not loaded or changed.

## PRD review

- [ ] Each requirement has a unique stable ID.
- [ ] Requirements describe observable outcomes or incident-preventing guarantees.
- [ ] Binding language uses must, must not, should, or may consistently.
- [ ] Requirements avoid routes, libraries, components, algorithms, columns, flags, and vendor mechanics.
- [ ] Scope, actors, non-goals, edge cases, and acceptance examples are coherent.
- [ ] Cross-domain rules are linked rather than duplicated.
- [ ] No unresolved material question remains in an active PRD.

## SDD and architecture review

- [ ] Every design rule traces to a requirement, accepted ADR, or explicit engineering constraint.
- [ ] Goals and non-goals match the approved proposal.
- [ ] Boundaries and dependency direction are clear.
- [ ] State transitions and invariants cover invalid and terminal states.
- [ ] Frontend behavior covers loading, empty, error, success, responsive, and accessibility states.
- [ ] API behavior covers method, input, validation, authentication, authorization, status, errors, side effects, and idempotency.
- [ ] Data design covers ownership, relations, deletion, transactions, indexes, migration, backfill, and recovery.
- [ ] Failure handling covers partial success, retry, consistency, and observability.
- [ ] Alternatives and consequences are honest.
- [ ] Durable cross-cutting choices have ADRs.
- [ ] Frontmatter links and code/test maps are accurate.

## Security and privacy review

- [ ] Every user-scoped operation authenticates server-side.
- [ ] Ownership is enforced server-side for reads and mutations.
- [ ] Client-supplied user or role identifiers are never authority.
- [ ] Admin authorization is checked at the API boundary.
- [ ] Public/shared-resource exceptions are explicit and narrow.
- [ ] Error responses do not disclose record existence or sensitive internals unnecessarily.
- [ ] Logs and documents exclude credentials, tokens, cookies, URLs containing secrets, and personal data.
- [ ] Account disablement, deletion, retention, and recovery behavior is deliberate.
- [ ] Adversarial signed-out, cross-user, and non-admin cases have evidence.

## Database and migration review

- [ ] The Prisma schema remains the exact structural authority.
- [ ] Relations, uniqueness, nullability, defaults, and referential actions match invariants.
- [ ] Indexes have a documented query rationale.
- [ ] Migration compatibility with deployed code is understood.
- [ ] Destructive operations, backfills, locks, and runtime are assessed.
- [ ] Recovery or roll-forward steps are executable.
- [ ] Already-deployed migrations are not rewritten.
- [ ] Local and hosted database targets are unmistakably separated.

## API review

- [ ] Browser calls use the shared API wrapper and shared types.
- [ ] Runtime validation exists at the server boundary.
- [ ] Unsupported methods, malformed requests, unauthenticated access, forbidden access, not-found cases, and internal failures are intentional.
- [ ] Response types and documented status codes agree.
- [ ] Mutations define side effects and idempotency expectations.
- [ ] Ownership filters cannot be bypassed by choosing another identifier.

## Frontend review

- [ ] Page and component responsibilities follow established boundaries.
- [ ] UI states are understandable without relying only on color.
- [ ] Keyboard access, focus, labels, and error association are considered.
- [ ] Mobile and desktop layouts are verified.
- [ ] Requests handle cancellation, duplicate action, latency, and failure where relevant.
- [ ] Client-side visibility is not treated as authorization.

## Testing and verification review

- [ ] Tests verify requirements rather than implementation trivia.
- [ ] Binding requirement IDs appear in direct verification tests.
- [ ] Red-phase failure was demonstrated for Full SDD where practical.
- [ ] Success, boundary, failure, and adversarial cases are proportional to risk.
- [ ] Required repository checks were executed and results recorded.
- [ ] Manual evidence names actor, precondition, action, and observed result.
- [ ] Environment-dependent claims were inspected through an authorized source rather than guessed.
- [ ] Known gaps have owners or explicit acceptance.

## Full SDD phase review

- [ ] Clarify defines the problem and resolves material unknowns.
- [ ] Proposal separately defines scope, non-goals, requirement deltas, and acceptance criteria.
- [ ] Design implements the approved proposal and records alternatives.
- [ ] Tasks cover Red tests, implementation, data/configuration, docs, verification, and archive.
- [ ] Implementation did not silently diverge from approved design.
- [ ] Verification maps every criterion to evidence.
- [ ] Canonical documents were synchronized before Archive.
- [ ] No current rule remains only in the archived package.

## Final documentation review

- [ ] The changed fact is stored in exactly one authoritative place.
- [ ] Cross-references resolve and explain their relationship.
- [ ] Status and `last_verified` are honest.
- [ ] Product inventory was reviewed for user-visible change.
- [ ] The final result states which specifications changed or records `No specification change` with a reason.
