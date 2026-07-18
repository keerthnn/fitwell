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
| `AdminAccess` | Server-enforced admin permission | One-to-one with `User`; checked by `requireAdmin`. |

## Schema changes

1. Update `prisma/schema.prisma` with the model, field, enum, relation, and index changes.
2. Create and review a Prisma migration in `prisma/migrations/` using the project's Prisma workflow.
3. Regenerate the Prisma client as required by the configured generator, which writes to `src/generated/prisma`.
4. Update API queries, shared client types, and UI flows affected by the changed data contract.

Do not manually edit historical migrations. Preserve user ownership and cascade behavior when adding related data.
