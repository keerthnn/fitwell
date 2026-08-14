# Documentation templates

## Purpose

Templates define the minimum structure and writing instructions for canonical specifications and Full SDD change artifacts. They reduce omissions without turning review into form-filling.

## Canonical templates

- [PRD template](product-requirements-template.md) for binding product outcomes.
- [Feature SDD template](engineering-sdd-template.md) for stack-specific design and traceability.
- [ADR template](decision-record-template.md) for durable technical choices.

## Full SDD templates

Use these as separate artifacts in exact order:

1. [Clarify](clarify-template.md)
2. [Proposal](proposal-template.md)
3. [Design](design-template.md)
4. [Tasks](tasks-template.md)
5. Implementation follows the approved tasks; it has no separate template.
6. [Verification](verification-template.md)
7. Archive after canonical synchronization.

## Use rules

- Copy the template into its canonical destination and replace every bracketed instruction.
- Keep every required section. If a section does not apply, write `Not applicable` and explain why.
- Remove instructional examples that are not relevant to the authored document.
- Do not activate a document with unresolved material questions or example-only content.
- Keep frontmatter fields and use repository-relative references.
- Add detail proportional to risk; never omit security, authorization, data, migration, or recovery analysis when applicable.
