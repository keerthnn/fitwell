# Data model

The Prisma schema lives in `prisma/schema.prisma` and uses PostgreSQL. Access the database through the shared client in `src/lib/prisma.ts`.

| Model | Purpose | Key relationships |
| --- | --- | --- |
| `User` | Application account keyed by Firebase UID | Has one optional profile, many workouts, and optional admin access. |
| `UserProfile` | Onboarding and fitness-profile data | One-to-one with `User`; cascades on user deletion. |
| `Workout` | A dated workout session | Belongs to a user and has many workout exercises. |
| `Exercise` | Reusable exercise catalog entry | Used by many workout exercises; categorized by equipment and movement enums. |
| `WorkoutExercise` | An exercise included in a workout | Joins a workout and an exercise; has ordered sets. |
| `WorkoutSet` | Recorded performance for one exercise set | Belongs to a workout exercise. |
| `WorkoutPlan` | Built-in or private workout programme | Has ordered plan exercises and can source workouts. |
| `WorkoutPlanExercise` | Ordered guidance within a Workout Plan | Joins a plan and an exercise. |
| `UserActivityDay` | Throttled daily application activity | Belongs to a user. |
| `AdminAccess` | Server-enforced admin permission | One-to-one with `User`; checked by `requireAdmin`. |
| `AdminAuditLog` | Audited sensitive admin state changes | Belongs to the acting admin. |

## Schema changes

1. Update `prisma/schema.prisma` with the model, field, enum, relation, and index changes.
2. Create and review a Prisma migration in `prisma/migrations/` using the project's Prisma workflow.
3. Regenerate the Prisma client as required by the configured generator, which writes to `src/generated/prisma`.
4. Update API queries, shared client types, and UI flows affected by the changed data contract.

FitWell is local-development-only. Run `pnpm run db:assert-local` before any reset. The clean Version 1 migration may replace disposable local history, but Firebase identities are never part of a Prisma reset.
