# Database documentation

## Purpose

Database documentation explains data meaning, invariants, lifecycle, performance rationale, and safe schema evolution. It does not reproduce exact Prisma models.

## Authority split

| Concern | Authority |
| --- | --- |
| Exact models, fields, enums, and relations | `prisma/schema.prisma` |
| Historical transitions | Committed migration directories |
| Domain meaning and invariants | [Database design](database-design.md) and feature SDDs |
| Retention, deletion, and recovery | [Data lifecycle](data-lifecycle.md) |
| Index rationale | [Indexes and performance](indexes-and-performance.md) |
| Safe evolution | [Migration policy](migration-policy.md) and runbooks |
| Actual hosted state | Authorized database/migration inspection |

## Responsibilities

Schema authors explain invariant and lifecycle consequences, not just fields. Reviewers examine referential actions, ownership, uniqueness, nullability, indexes, compatibility, backfill, and recovery. Destructive or relationship-redesign work uses Full SDD.
