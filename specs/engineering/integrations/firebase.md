---
id: integration-firebase
title: Firebase Integration Standard
status: draft
authority: engineering
requirements: []
decisions: []
code: []
tests: []
last_verified: null
---

# Firebase integration

## Purpose

This document governs what must be recorded about Firebase as an external identity dependency. It does not duplicate SDK documentation.

## Required integration record

An active revision must define:

- Project/environment mapping without secret identifiers where inappropriate.
- Enabled sign-in methods and who may change them.
- Authorized domains and verification source.
- Client SDK versus Admin SDK responsibilities.
- Required configuration variable names and client/server exposure.
- Token verification, revocation, persistence, and outage assumptions.
- Identity deletion/disablement relationship to application accounts.
- Quotas, limits, audit/log availability, and incident contacts when relevant.
- Safe rotation and recovery procedure.

## Rules

- Verify Firebase Console state through an authorized source.
- Never include service-account private keys, token values, or user records.
- Link authentication and authorization architecture for application behavior.
- Treat provider availability and application database availability as separate failure domains.
- Any sign-in-method, token, credential-transport, or identity-lifecycle change uses Full SDD.

## Review

Record evidence date and environment. Stale or inaccessible console state is an explicit operational risk, not silently accepted truth.
