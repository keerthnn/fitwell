# External integrations

## Purpose

Integration documents record constraints controlled partly outside the repository. They prevent agents and developers from guessing console settings, service limits, environment wiring, or provider responsibilities.

## Documents

- [Firebase](firebase.md) governs identity-provider integration evidence and boundaries.
- [Vercel](vercel.md) governs hosting/build/runtime integration evidence.
- [PostgreSQL hosting](postgresql-hosting.md) governs hosted database, pooling, transport, backup, and capacity evidence.

## Rules

- Document project decisions and non-discoverable state, not copied vendor API schemas.
- Prefer authorized live provider information for volatile facts.
- Never store credentials, tokens, private keys, database URLs, or personal data.
- State environment, source of truth, last verified date, and failure consequence for every console-only setting.
- Unknown state remains unknown until inspected; code assumptions are not proof of provider configuration.

## Responsibilities

The change author updates integration docs when provider configuration or constraints change. Operational reviewers verify external state before activating or executing dependent runbooks.
