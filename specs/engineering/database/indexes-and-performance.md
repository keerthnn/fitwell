---
id: database-indexes-and-performance
title: Indexes and Performance
status: active
authority: engineering
requirements: [DATA-005, DATA-006]
decisions: [ADR-0004]
code: [prisma/schema.prisma, src/pages/api/]
tests: []
last_verified: 2026-08-15
---

# Indexes and performance

## Implemented rationale

| Model and fields | Repository query or invariant supported |
| --- | --- |
| `User.email` unique | Identity synchronization and account uniqueness. |
| `UserProfile.userId` unique | One profile per application user. |
| `Exercise(name,equipment)` unique | Prevents duplicate catalogue variants; seed upserts rely on it. |
| `Exercise(category,primaryMuscle,isActive)` | Member catalogue filtering over active exercises. |
| `Workout(userId,workoutDate,status)` | Owner history, dashboard, and analytics date/status queries. |
| `Workout(sourceWorkoutPlanId,entryMode)` | Plan usage aggregation and source lookup. |
| `WorkoutExercise(workoutId,order)` / `WorkoutSet(workoutExerciseId,setNumber)` | Ordered nested workout reads. |
| `WorkoutPlan(userId,isArchived)` | Owner plan listing. |
| `WorkoutPlan(isBuiltIn,isActive,isFeatured)` | Visible/featured built-in plan discovery. |
| `WorkoutPlanExercise(workoutPlanId,order)` | Ordered plan prescription reads. |
| `UserActivityDay(userId,activityDate)` unique | Daily activity upsert; prevents duplicate owner/date rows. |
| `UserActivityDay(activityDate)` | Date-window activity summaries. |
| `AdminAuditLog(adminId,createdAt)` and `(entityType,entityId)` | Actor chronology and entity investigation. |
| `Feedback(userId,status,lastMessageAt)` | Owner inbox filters/order. |
| `Feedback(status,category,lastMessageAt)` | Administrator inbox filters/order. |
| `FeedbackMessage(feedbackId,createdAt)` | Chronological thread reads. |

No explain plans, production cardinality, latency measurements, database monitoring, or capacity thresholds are committed. The rationale above is inferred directly from query predicates and ordering in handlers; it is not evidence of hosted performance.
