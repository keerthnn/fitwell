---
id: quality-testing-strategy
title: Testing Strategy and Current State
status: active
authority: engineering
requirements: [SEC-001, SEC-002, SEC-003, SEC-004, DATA-002, DATA-003, DATA-005, DATA-006]
decisions: []
code: [vitest.config.ts, package.json, test cases/]
tests: []
last_verified: 2026-08-15
---

# Testing strategy and current state

## Current repository evidence

Vitest 3 is configured with a Node environment and includes `test cases/**/*.test.ts` and `test cases/**/*.test.tsx`. Testing Library, jest-dom, and jsdom are installed. The `fitness` alias resolves to `src`. At bootstrap, the `test cases/` directory contains no test files, so no implemented requirement currently has automated test evidence.

## Required strategy for future changes

- Pure unit tests cover validators, transformations, time/unit calculations, and state transitions.
- API tests cover method, malformed input, signed-out access, owner/admin isolation, persistence, transaction outcomes, and safe errors.
- Component tests cover user interaction and loading, empty, error, and success states.
- Manual/end-to-end evidence covers Firebase, cookies, responsive navigation, Vercel configuration, and cross-page flows not credibly isolated.
- Database and deployment changes include migration/configuration/operational evidence.

Tests live under `test cases/` and mirror `src/`. They assert observable behavior and use requirement IDs in names when directly proving a requirement. Authentication and authorization tests are adversarial; time, timezone, and units are controlled explicitly. A passing test does not replace a PRD or SDD.

## Bootstrap gap

The absence of test files is a material verification gap across every domain. This documentation records the gap but does not claim failures or create tests because the bootstrap task may not modify implementation.
