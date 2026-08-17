---
id: operations-environments
title: Environments
status: active
authority: operational
last_verified: 2026-08-15
---

# Environments

| Environment | Repository-visible definition |
| --- | --- |
| Local | Node 22/pnpm application, `.env`, local PostgreSQL host and database name `fitness`. Local guard rejects production mode, remote/cloud hosts, and other database names before documented reset/seed work. |
| Vercel production | Next.js deployment with variables from `.env.example`, pooled `DATABASE_URL`, committed migrations applied separately, and deployed hostname authorized in Firebase. |
| Preview | No repository-specific database, Firebase, branch, data, or variable policy is documented. |

No live environment was inspected. Environment identifiers, provider projects, deployed revisions, data contents, and isolation remain unknown. Production data and credentials must not be used by local work, and destructive commands require a resolved target.
