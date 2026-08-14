---
id: integration-vercel
title: Vercel Integration Standard
status: draft
authority: engineering
requirements: []
decisions: []
code: []
tests: []
last_verified: null
---

# Vercel integration

## Purpose

This document governs FitWell's hosting integration, including repository linkage, build/runtime behavior, environment separation, and dashboard-only configuration.

## Required integration record

An active revision must define:

- Project and Git linkage.
- Production and preview branch behavior.
- Runtime and package-manager selection.
- Install, build, generated-client, migration, and start responsibilities.
- Environment variable scoping and ownership.
- Serverless execution, filesystem, timeout, and connection constraints.
- Deployment protection, observability, logs, and rollback capabilities.
- Custom/authorized domain dependencies.
- Verified limits and failure behavior.

## Rules

- Repository configuration and Vercel dashboard state are distinct authorities.
- Never record environment values or deployment tokens.
- Database migration must not occur implicitly unless an approved design and runbook make concurrency safe.
- Preview environments must not silently use production identity or data.
- Hosting/runtime architecture changes require Full SDD.

## Review

Before activating, compare repository settings, Vercel project settings, and a clean deployment. Record environment and verification date.
