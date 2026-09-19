# Documentation policy

Authority: **Binding process**

## Purpose

This policy defines how FitWell records durable product and engineering knowledge. It governs every document under `specs/`, every change that affects a documented contract, and every agent or developer who authors or consumes specifications.

The policy exists to make future work reproducible. A developer should be able to understand what FitWell promises, why an engineering choice exists, how a change was verified, and what must be updated without relying on chat history or memory.

## Docs as Contracts

Docs-as-Contracts means that active specifications are part of the engineering system, not optional commentary.

- A PRD contracts observable behavior.
- An SDD contracts the approved implementation design and invariants.
- An accepted ADR contracts a durable technical choice.
- An active runbook contracts a safe operational procedure.
- Tests provide executable evidence that selected contracts hold.
- Code, validators, schema, and migrations provide the exact current executable state.

An intentional contract change is incomplete until the implementation, tests, and affected canonical documents agree. A bug fix that restores an existing contract normally changes code and tests, not the contract itself.

Docs-as-Contracts does not mean documenting every implementation detail. Documents own rationale, boundaries, invariants, observable behavior, failure semantics, and procedures that future contributors could otherwise misunderstand.

## Single-authority rule

Each fact must have one authoritative home. Other documents link to it and add only the context appropriate to their layer.

Example: a PRD owns the promise that users cannot access another user's private workouts. The authorization SDD owns the server-side enforcement design. The API catalog identifies affected routes. Tests name the security requirement and verify adversarial access. Copying the complete rule into every layer would create multiple sources of truth.

## Authority model

| Authority | Responsibility | Examples |
| --- | --- | --- |
| Informational | Explain direction, vocabulary, inventory, or priorities | Product brief, feature catalog, roadmap |
| Binding product | Define observable behavior and system qualities | Domain PRDs, security and data requirements |
| Binding process | Define mandatory authoring, review, traceability, and verification behavior | Handbook workflow, verification matrix |
| Binding engineering | Define mandatory technical constraints | Authorization model, API conventions |
| Engineering | Define approved implementation design and rationale | Architecture and feature SDDs |
| Decision | Preserve an accepted durable technical choice | ADRs |
| Operational | Define safe configuration, deployment, migration, and recovery procedures | Runbooks |
| Temporary | Define an approved change delta during Full SDD | Active change package |
| Executable | Express exact current machine-readable behavior | Code, validators, schema, migrations, tests |

Document status affects authority. A `draft` is review material and is not binding. An `active` canonical document governs future work. A `superseded` or `retired` document remains historical but no longer governs implementation.

## Canonical and supporting documents

Canonical documents are PRDs, active SDDs, accepted ADRs, active API/data standards, and active runbooks. Change packages are supporting history after Archive. Product documents inform decisions but do not authorize behavior.

The archive must never be the only place where a current requirement, invariant, or operating procedure exists.

## Synchronization rules

Every implementation change ends with a specification-sync decision.

Update canonical documents in the same change when any of the following changes intentionally:

- Observable product behavior or acceptance criteria.
- Authentication, authorization, or ownership semantics.
- An API contract, validation rule, status code, or side effect.
- A data invariant, relation, retention rule, index rationale, or migration procedure.
- A cross-domain dependency or architectural boundary.
- An accepted technical decision.
- Environment configuration, external console state, deployment, or recovery procedure.
- A product capability listed in the feature catalog.

Record `No specification change` with a reason when the work is behavior-preserving or restores an already documented contract. This is a review result, not a shortcut around documentation.

Full SDD work synchronizes canonical documents during Verification and before Archive. Lightweight work synchronizes them before completion.

## Conflict resolution

Resolve conflicts in this order:

1. Protect authentication, authorization, privacy, and user data.
2. Check whether an approved active change explicitly declares a temporary delta.
3. Use the PRD for the required observable outcome.
4. Use binding engineering standards and accepted ADRs for mandatory technical constraints.
5. Use the feature SDD for implementation design within those constraints.
6. Use executable artifacts to determine current behavior, never to silently redefine intended behavior.
7. Treat informational documents as context only.

When code and a binding document disagree, classify the mismatch before editing:

- **Implementation defect:** restore the contract and add regression evidence.
- **Outdated contract:** approve the behavior change and synchronize documentation.
- **Ambiguous contract:** clarify with Keerthan K, the project owner, before implementation.
- **Contradictory contracts:** stop and obtain an explicit precedence decision; create an ADR if the resolution is durable and technical.

## Documentation lifecycle

### Draft

The document is being authored or bootstrapped. It may contain unresolved questions and cannot be cited as an approved contract.

### Active

The document has been reviewed, has no material unresolved questions, and reflects the intended contract or procedure. `last_verified` records when it was compared with relevant implementation or external state.

### Superseded

Another document replaces it. Preserve the history, link the replacement, and remove it from current navigation except where historical context is useful.

### Retired

The governed capability or procedure no longer exists. Record why and when it was retired. Do not delete it when the history explains surviving decisions.

### Archived change

The change completed Verification, synchronized canonical documents, and moved to the yearly archive. Its status is historical evidence, not current authority.

## Maintenance responsibilities

The author of a change owns documentation synchronization. Reviewers verify both content and placement. Keerthan K, the project owner, resolves contract conflicts and approves Full SDD phase transitions.

Documents are reviewed when touched, before a release if they describe shipped behavior, before an operational procedure is executed, and whenever evidence shows an assumption is stale. Do not perform meaningless date-only updates; `last_verified` changes only after comparison with authoritative evidence.

## Sensitive and volatile information

Never store credentials, private keys, tokens, cookie values, database URLs, personal data, or secret values in specifications. Document variable names, responsibility, storage location, rotation procedure, and failure behavior instead.

Do not copy volatile third-party API schemas into Markdown. Link or query the authoritative provider source and document only FitWell's choice, constraint, console-only state, rate limit, or operational dependency.
