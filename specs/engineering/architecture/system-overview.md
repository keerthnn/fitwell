---
id: architecture-system-overview
title: System Overview Standard
status: draft
authority: engineering
requirements: []
decisions: []
code: []
tests: []
last_verified: null
---

# System overview

## Purpose

This document governs the future system-level description of FitWell. It must let a new engineer understand the deployed context and major data flows without reading every feature SDD.

## Required content

An active revision must define:

- Actors and external systems.
- Browser, application runtime, identity service, database, and hosting boundaries.
- Trust boundaries and where credentials or user data cross them.
- Major product domains and their ownership.
- Primary request, authentication, persistence, and deployment flows.
- Synchronous versus asynchronous behavior, if any.
- Environment topology and links to operational detail.

## Rules

- Stay above route, component, and table detail.
- Use a system-context diagram when three or more boundaries interact.
- Link feature SDDs for domain internals and integrations/runbooks for external state.
- Distinguish verified current topology from planned changes.
- Add an ADR when changing the fundamental application shape or external system boundary.

## Responsibilities

Cross-domain and infrastructure changes review this document. Activation requires comparison with deployment configuration, integration records, and representative code paths.
