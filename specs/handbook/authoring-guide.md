# Authoring guide

Authority: **Engineering guidance**

## Naming

- Use lowercase kebab-case for folders and Markdown filenames.
- Use semantic names such as `workout-engine.md`; avoid `misc.md`, `notes.md`, or `new-design.md`.
- Name decision records `NNNN-semantic-decision.md`.
- Name active change directories `YYYY-MM-DD-semantic-change-name`.

## Requirement IDs

Use stable domain prefixes: `AUTH`, `PROFILE`, `ONBOARD`, `EXERCISE`, `WORKOUT`, `PLAN`, `DASH`, `ANALYTICS`, `FEEDBACK`, `ADMIN`, `SEC`, `DATA`, and `A11Y`.

- Format IDs as `PREFIX-NNN`.
- Never reuse a retired ID.
- Preserve an ID for editorial clarification that does not change meaning.
- Create a new ID when the required behavior materially changes.

## Requirement language

- Use **must** for binding behavior, **should** for recommendations, and **may** for optional behavior.
- Make requirements observable and testable.
- Keep vendor names, routes, algorithms, tables, columns, flags, and implementation mechanics out of PRDs.
- Put stack-dependent mechanisms in engineering SDDs.

## Metadata

Use the frontmatter defined by the corresponding template. Repository-relative paths are required in frontmatter. Use empty arrays and `null` for relationships or verification dates not yet established; do not invent links.

## Linking and duplication

- Use relative Markdown links for navigation.
- Use repository-relative paths inside frontmatter.
- Link to exact TypeScript types, validators, Prisma schema, migrations, and tests instead of copying them.
- Explain rationale, invariants, boundaries, and failure behavior that code alone cannot communicate reliably.

## Diagrams and examples

Use the smallest diagram that materially clarifies a flow, state machine, boundary, or relationship. Examples illustrate a contract but do not replace a requirement.

## Placeholders

Unbootstrapped documents must remain `draft`, use empty traceability lists, and contain explicit bootstrap prompts. Do not present assumptions as current behavior.
