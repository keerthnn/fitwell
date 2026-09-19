# Specification authoring

FitWell's canonical detailed rules live in the [Authoring guide](../handbook/authoring-guide.md). This
entry point summarizes the rules every PRD, SDD, ADR, and Full SDD delta must follow.

## Layer placement

- Product: why, audience, journey, priorities, and verified inventory; informational language only.
- PRD: observable and stack-independent outcomes with stable IDs.
- SDD/architecture: stack-specific boundaries, invariants, failure semantics, and mappings.
- ADR: a durable choice with credible alternatives and consequences.
- Code/test: executable detail and evidence.
- Change package: temporary approved delta, never the final home of current truth.

## Requirement language

Use one testable contract per stable ID. Prefer EARS forms:

- Ubiquitous: `The system must ...`
- Event: `When <event>, the system must ...`
- State: `While <state>, the system must ...`
- Optional feature: `Where <feature>, the system must ...`
- Failure: `If <condition>, the system must ...`

Use `must not` for prohibited behavior and plan a negative test. Avoid vague words such as seamless,
appropriate, robust, fast, or secure unless the document defines a measurable threshold.

## Stable identifiers and links

Preserve IDs after activation, including retired IDs. PRDs link SDDs; SDDs list requirement and ADR
IDs plus stable code/test paths; tests name binding IDs where useful. Link to the authoritative home
instead of copying the complete rule.

## Lifecycle and review

Use repository templates. `draft` material is not binding; `active` canonical documents govern;
`superseded` and `retired` remain historical; archived packages are evidence only. Update
`last_verified` only after comparison with authoritative evidence. A reviewer must be able to teach a
rule back, identify its authority, state success/failure behavior, and follow it to evidence.

