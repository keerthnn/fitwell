---
id: architecture-authentication-flow
title: Authentication Flow Standard
status: draft
authority: engineering
requirements: []
decisions: []
code: []
tests: []
last_verified: null
---

# Authentication flow

## Purpose

This document governs how an external identity becomes a trusted server principal and an application-user state. It is stack-specific design; user-visible outcomes remain in the Authentication PRD.

## Required content

An active revision must define:

- Identity-provider responsibilities and enabled sign-in methods.
- Client initialization and persistence.
- Token acquisition, refresh, expiry, and revocation.
- Secure browser-to-server credential transport.
- Server verification and principal derivation.
- Application-user creation or synchronization.
- Signed-out, invalid, expired, disabled, deleted, and partially provisioned states.
- Sign-out cleanup and multi-tab behavior.
- Safe logging, errors, retries, and provider outages.
- External console configuration and authorized-domain dependencies by link.

## Rules

- Never trust client claims without server verification.
- Never store credential values in documentation or logs.
- Distinguish identity-provider state from application-account state.
- Authentication establishes identity; authorization still decides access.
- Token or cookie changes require adversarial tests and Full SDD.

## Review

Activation requires inspection of both code and authorized identity-provider configuration. Any invisible state not verified remains an explicit gap.
