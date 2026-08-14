---
id: architecture-frontend
title: Frontend Architecture Standard
status: draft
authority: engineering
requirements: []
decisions: []
code: []
tests: []
last_verified: null
---

# Frontend architecture

## Purpose

This document governs how future FitWell user interfaces are routed, composed, styled, supplied with state, and connected to server APIs.

## Required design areas

An active revision must define:

- Route and shell responsibilities.
- Provider ordering and global-context boundaries.
- Page-local versus reusable state.
- Typed browser-to-API access.
- Theme tokens, component styling, responsive layout, and icon use.
- Loading, empty, error, success, and partial-data states.
- Form validation and server-error presentation.
- Accessibility, keyboard, focus, and reduced-motion expectations.
- Local persistence and its privacy/lifecycle constraints.

## Rules

- Client-side visibility is presentation, never authorization.
- Pages coordinate route concerns; reusable components remain focused and prop-driven.
- Use the shared theme and existing components before inventing local systems.
- Server data must have an explicit source, refresh strategy, and failure state.
- Store no secret or authoritative ownership/role state in the browser.
- UI tests verify user behavior, not component internals.

## Review

New global state, a new styling system, provider-order changes, or a new client data-access pattern require architecture review.
