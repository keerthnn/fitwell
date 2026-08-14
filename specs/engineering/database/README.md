# Database documentation

Database documents explain meaning, invariants, lifecycle, performance rationale, and operations. They do not duplicate the exact Prisma schema.

- [Database design](database-design.md)
- [Data lifecycle](data-lifecycle.md)
- [Indexes and performance](indexes-and-performance.md)
- [Migration policy](migration-policy.md)

Authority is divided as follows:

| Concern | Source |
| --- | --- |
| Exact models, fields, enums, and relations | `prisma/schema.prisma` |
| Historical transitions | `prisma/migrations/` |
| Meaning and invariants | Database and feature SDDs |
| Index rationale | `indexes-and-performance.md` |
| Migration and deployment procedure | `migration-policy.md` and operations runbooks |
