---
id: integration-postgresql-hosting
title: PostgreSQL Hosting Standard
status: draft
authority: engineering
requirements: []
decisions: []
code: []
tests: []
last_verified: null
---

# PostgreSQL hosting

## Purpose

This document governs externally controlled PostgreSQL hosting facts that affect correctness, capacity, deployment, backup, and recovery.

## Required integration record

An active revision must define:

- Provider and environment mapping.
- Direct versus pooled connection purpose.
- SSL/TLS and certificate requirements.
- Connection, transaction, storage, compute, and timeout limits.
- Region and latency assumptions.
- Backup schedule, retention, point-in-time recovery, and restore testing.
- Maintenance windows and version policy.
- Monitoring, alerting, access control, and incident procedure.
- Migration connectivity and operational ownership.

## Rules

- Never store connection strings, passwords, or database contents.
- A backup claim requires provider evidence; a recovery claim requires a tested restore procedure.
- Serverless connection behavior must be reconciled with pooling and Prisma configuration.
- Production and non-production targets must be unmistakable before destructive operations.
- Provider, pooling, region, or recovery changes require Full SDD.

## Review

Reverify after provider plan/configuration changes and before relying on recovery guarantees.
