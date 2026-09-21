-- Normalize the former workout-count preference into a valid weekly day target.
UPDATE "UserProfile"
SET "weeklyWorkoutTarget" = LEAST(7, GREATEST(1, "weeklyWorkoutTarget"));

-- Preserve the valid range at the database boundary as well as in API validation.
ALTER TABLE "UserProfile"
ADD CONSTRAINT "UserProfile_weeklyWorkoutTarget_range_check"
CHECK ("weeklyWorkoutTarget" BETWEEN 1 AND 7);

-- CreateTable
CREATE TABLE "WorkoutDayTargetHistory" (
    "id" TEXT NOT NULL,
    "userProfileId" TEXT NOT NULL,
    "daysPerWeek" INTEGER NOT NULL,
    "effectiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkoutDayTargetHistory_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "WorkoutDayTargetHistory_daysPerWeek_range_check"
      CHECK ("daysPerWeek" BETWEEN 1 AND 7)
);

-- Backfill the only target that can be recovered for existing profiles. The deterministic ID avoids
-- requiring a PostgreSQL UUID extension during deployment.
INSERT INTO "WorkoutDayTargetHistory" ("id", "userProfileId", "daysPerWeek", "effectiveAt")
SELECT
    'baseline-' || "id",
    "id",
    "weeklyWorkoutTarget",
    "createdAt"
FROM "UserProfile";

-- CreateIndex
CREATE INDEX "WorkoutDayTargetHistory_userProfileId_effectiveAt_idx"
ON "WorkoutDayTargetHistory"("userProfileId", "effectiveAt");

-- AddForeignKey
ALTER TABLE "WorkoutDayTargetHistory"
ADD CONSTRAINT "WorkoutDayTargetHistory_userProfileId_fkey"
FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
