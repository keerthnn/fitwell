# Engineering decision records

## Purpose

ADRs preserve durable technical choices and the constraints that made them reasonable. They prevent future contributors from removing a load-bearing design merely because the original discussion is no longer visible.

## When to create an ADR

Create one when a choice affects multiple domains, establishes a repository convention, changes a trust/data/deployment boundary, introduces or replaces an external dependency, is costly to reverse, or has multiple credible alternatives.

Do not create one for routine code organization, a local variable, ordinary CRUD following active standards, or a choice whose only rationale is “already implemented.”

## Lifecycle

- `proposed`: under review and not binding.
- `accepted`: binding decision.
- `superseded`: replaced by a named later ADR.
- `rejected`: considered and deliberately not selected.

Accepted ADRs are immutable in substance. Correct typos directly; supersede a changed decision with a new ADR and reciprocal links.

## Naming and content

Use `NNNN-semantic-decision.md` and ID `ADR-NNNN`. Allocate the next unused number; never renumber. Use the [ADR template](../../templates/decision-record-template.md). Context, alternatives, consequences, security/data impact, and related PRDs/SDDs are required.

## Review

The project owner accepts or rejects ADRs. Every active SDD citing a superseded ADR must be reviewed. This index lists accepted and historically relevant records once they exist; no fictitious example ADR occupies the sequence.
