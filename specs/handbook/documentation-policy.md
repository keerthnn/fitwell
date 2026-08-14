# Documentation policy

Authority: **Binding process**

## Principles

- The repository is the durable source of engineering knowledge.
- Stable requirements, implementation constraints, and operational procedures are contracts.
- Each fact has one authoritative home; other documents link to it.
- Documentation effort follows risk and should not narrate obvious code.
- Agents and developers load only the documents relevant to the work.
- Intentional contract changes update canonical documentation with the implementation.

## Authority classes

| Class | Meaning | Typical documents |
| --- | --- | --- |
| Informational | Context and direction; does not authorize implementation | Product brief, feature catalog, roadmap |
| Binding product | Observable behavior and cross-cutting product qualities | PRDs, system qualities |
| Binding process | Mandatory authoring, workflow, traceability, and verification rules | Handbook workflow, verification matrix |
| Binding engineering | Mandatory implementation constraints | Authorization model, API conventions |
| Engineering | Approved design and rationale | Architecture and feature SDDs |
| Decision | Accepted technical choice until superseded | Decision records |
| Operational | Required deployment, migration, or recovery procedure | Runbooks |
| Temporary | Approved work-in-progress delta | Active Full SDD change package |
| Executable | Exact machine-readable current state | Code, validators, schema, migrations, tests |

## Conflict resolution

1. Protect authentication, authorization, privacy, and user data first.
2. Check whether an approved active change explicitly supersedes a canonical statement.
3. Use the PRD for the required outcome and the SDD for implementation design.
4. Use accepted decision records for durable architectural choices.
5. Treat code/document disagreement as drift, not as automatic proof that either side is correct.
6. Stop and ask the project owner when binding documents materially conflict.

## Document lifecycle

Canonical documents use `draft`, `active`, `superseded`, or `retired`. Change packages use `proposed`, `approved`, `implementing`, `verified`, or `archived`.

- Draft documents are not binding until approved.
- Active documents are canonical.
- Superseded documents remain historical and link to their replacement.
- Retired documents no longer govern the project.
- Archived change packages preserve decision and verification history but are not the canonical home of lasting rules.

## Update policy

Update documentation when behavior, a contract, a data invariant, an architectural rule, external configuration, or an operational procedure intentionally changes. Do not update canonical documents for behavior-preserving refactors, generated output, temporary debugging, or bug fixes that merely restore an existing contract.

Every completed change records either the documentation updated or `No specification change` with a reason.
