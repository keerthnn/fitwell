---
id: api-endpoint-catalog
title: API Endpoint Catalog Standard
status: draft
authority: binding-engineering
requirements: []
code: []
tests: []
last_verified: null
---

# API endpoint catalog

## Purpose

The endpoint catalog is the canonical human-readable route inventory. It supports impact analysis and traceability without copying complete TypeScript interfaces.

## Required endpoint entry

Every endpoint is grouped by domain and records:

| Field | Required content |
| --- | --- |
| Method and path | Exact HTTP method and stable route |
| Purpose | One observable operation |
| Access | Public, authenticated, or administrator |
| Ownership | Resource and server-side predicate, or Not applicable |
| Input | Links to shared type and runtime validator |
| Success | Status and response type |
| Errors | Expected statuses and conditions |
| Side effects | Data/external changes and repeat behavior |
| Requirements | Stable requirement IDs |
| Implementation | Handler path |
| Tests | Direct verification paths |
| Last verified | Date checked against code/tests |

## Example entry

```markdown
### POST /api/<domain>/<operation>

- Purpose: <observable result>
- Access: Authenticated
- Ownership: <resource> must belong to the verified principal
- Input: `request type link` and `validator link`
- Success: 200 — `response type link`
- Errors: 400 invalid input; 401 invalid identity; 404 inaccessible target
- Side effects: <records changed>; repeated-call behavior: <defined>
- Requirements: DOMAIN-001, SEC-001
- Implementation: `src/pages/api/<domain>/<operation>.ts`
- Tests: `test cases/pages/api/<domain>/<operation>.test.ts`
```

## Catalog rules

- Do not add an endpoint until its contract and authorization are reviewed.
- Link types and validators; do not paste their full fields.
- Use the endpoint's actual path as its identity.
- Update entries atomically with contract changes.
- Missing tests or unresolved ownership are explicit traceability gaps, not omitted fields.

## Domain sections

Maintain sections for Authentication; Profiles and Onboarding; Exercises; Workouts; Workout Plans; Dashboard and Analytics; Feedback; and Administration.
