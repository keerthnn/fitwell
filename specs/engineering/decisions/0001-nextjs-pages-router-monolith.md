---
id: ADR-0001
title: Use a Next.js Pages Router monolith
status: accepted
authority: decision
date: 2026-08-15
requirements: [SEC-002, DATA-002]
supersedes: []
superseded_by: null
---

# ADR-0001: Use a Next.js Pages Router monolith

## Context and decision

The repository delivers member UI, administrator UI, and HTTP handlers from one Next.js application. FitWell uses the Pages Router: browser pages live in `src/pages`, endpoints in `src/pages/api`, and shared TypeScript modules in the same build and deployment artifact. This repository structure is the preserved evidence; the original discussion is not present.

## Drivers and alternatives

Routing convention and deployment boundary affect every domain and are expensive to change. The repository contains no historical alternatives record. App Router and separately deployed frontend/backend architectures are not implemented, so this ADR does not invent rejection reasons.

## Consequences

Routing, rendering, handlers, types, and deployment share one release, enabling same-origin API calls and direct module sharing while coupling UI and API deployment and retaining Pages Router conventions.

## Security and data impact

API routes remain server trust boundaries even though they share a project with client code. Server-only credentials must never enter client bundles.

## Related documents and outcome

[System overview](../architecture/system-overview.md), [Frontend architecture](../architecture/frontend-architecture.md), [Backend architecture](../architecture/backend-architecture.md). Accepted as current architecture on 2026-08-15; review if router or deployment boundary changes.
