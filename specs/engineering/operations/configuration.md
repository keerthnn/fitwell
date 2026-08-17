---
id: operations-configuration
title: Configuration Inventory
status: active
authority: operational
last_verified: 2026-08-15
---

# Configuration inventory

`.env.example` is authoritative for names; values never belong in documentation.

| Variables | Exposure | Purpose and failure |
| --- | --- | --- |
| `DATABASE_URL` | Server-only | PostgreSQL connection for Prisma/runtime/migrations/seeds. Missing prevents database work; Vercel is documented to use a pooled URL. |
| `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTHDOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID` | Browser-visible | Firebase web initialization. Missing API key prevents client initialization; project ID is also used by Admin initialization. |
| `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` | Server-only secret | Firebase Admin credential and token verification. Escaped newlines in the key are normalized at runtime. |

Local values are expected in `.env`; production values are documented as Vercel environment variables. The repository has no startup schema validator, rotation procedure, preview scope proof, or secret-store evidence. Never log values or place Admin/database secrets in `NEXT_PUBLIC_*` variables.
