-- CreateEnum
CREATE TYPE "PreferredUnits" AS ENUM ('METRIC', 'IMPERIAL');

-- CreateEnum
CREATE TYPE "ActivityLevel" AS ENUM ('SEDENTARY', 'LIGHTLY_ACTIVE', 'MODERATELY_ACTIVE', 'VERY_ACTIVE');

-- CreateEnum
CREATE TYPE "WorkoutStatus" AS ENUM ('DRAFT', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "WorkoutIntensity" AS ENUM ('LIGHT', 'MODERATE', 'VIGOROUS');

-- CreateEnum
CREATE TYPE "CalorieSource" AS ENUM ('ESTIMATED', 'OVERRIDDEN');

-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK', 'PRE_WORKOUT', 'POST_WORKOUT', 'OTHER');

-- CreateEnum
CREATE TYPE "TemplateVisibility" AS ENUM ('PRIVATE', 'UNLISTED', 'PUBLIC');

-- CreateEnum
CREATE TYPE "TemplateDifficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "HealthStatus" AS ENUM ('ACTIVE', 'MANAGED', 'RESOLVED');

-- CreateEnum
CREATE TYPE "InjuryStatus" AS ENUM ('ACTIVE', 'RECOVERING', 'RESOLVED');

-- CreateEnum
CREATE TYPE "InjurySide" AS ENUM ('LEFT', 'RIGHT', 'BILATERAL', 'NOT_APPLICABLE');

-- CreateEnum
CREATE TYPE "AchievementCategory" AS ENUM ('WORKOUT', 'STREAK', 'NUTRITION', 'VOLUME', 'COMMUNITY');

-- DropIndex
DROP INDEX "Workout_userId_date_idx";

-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "contraindicationTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "instructions" TEXT,
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "safetyNotes" TEXT,
ADD COLUMN     "secondaryMuscleGroups" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarUrl" TEXT;

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "activityLevel" "ActivityLevel" NOT NULL DEFAULT 'MODERATELY_ACTIVE',
ADD COLUMN     "dailyCalorieTarget" INTEGER NOT NULL DEFAULT 2000,
ADD COLUMN     "preferredUnits" "PreferredUnits" NOT NULL DEFAULT 'METRIC',
ADD COLUMN     "preferredWorkoutDays" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
ADD COLUMN     "targetWeightKg" DOUBLE PRECISION,
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'UTC',
ADD COLUMN     "weeklyWorkoutTarget" INTEGER NOT NULL DEFAULT 3,
ALTER COLUMN "weightKg" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Workout" ADD COLUMN     "calorieSource" "CalorieSource",
ADD COLUMN     "caloriesBurned" INTEGER,
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "estimatedCaloriesBurned" INTEGER,
ADD COLUMN     "intensity" "WorkoutIntensity" NOT NULL DEFAULT 'MODERATE',
ADD COLUMN     "perceivedDifficulty" INTEGER,
ADD COLUMN     "startedAt" TIMESTAMP(3),
ADD COLUMN     "status" "WorkoutStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "templateId" TEXT;

-- AlterTable
ALTER TABLE "WorkoutSet" ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "restDurationS" INTEGER;

-- Preserve the semantics of records created before workout lifecycle fields existed.
UPDATE "Workout" SET "status" = 'COMPLETED', "completedAt" = "date";
UPDATE "WorkoutSet" SET "isCompleted" = true;

-- CreateTable
CREATE TABLE "NutritionEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "consumedAt" TIMESTAMP(3) NOT NULL,
    "mealType" "MealType" NOT NULL,
    "foodName" TEXT NOT NULL,
    "calories" INTEGER NOT NULL,
    "proteinG" DOUBLE PRECISION,
    "carbsG" DOUBLE PRECISION,
    "fatG" DOUBLE PRECISION,
    "fibreG" DOUBLE PRECISION,
    "servingQuantity" DOUBLE PRECISION,
    "servingUnit" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NutritionEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeightCheckIn" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL,
    "weightKg" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeightCheckIn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalCondition" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "HealthStatus" NOT NULL DEFAULT 'ACTIVE',
    "severity" TEXT,
    "startedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "clinicianGuidance" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicalCondition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Injury" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bodyRegion" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "side" "InjurySide" NOT NULL DEFAULT 'NOT_APPLICABLE',
    "status" "InjuryStatus" NOT NULL DEFAULT 'ACTIVE',
    "painLevel" INTEGER,
    "startedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "notes" TEXT,
    "exercisesToAvoid" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "contraindicationTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Injury_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutTemplate" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "goal" TEXT,
    "difficulty" "TemplateDifficulty" NOT NULL DEFAULT 'BEGINNER',
    "estimatedDurationM" INTEGER,
    "visibility" "TemplateVisibility" NOT NULL DEFAULT 'PRIVATE',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "shareToken" TEXT,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "copyCount" INTEGER NOT NULL DEFAULT 0,
    "useCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkoutTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateExercise" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "targetSets" INTEGER NOT NULL DEFAULT 3,
    "minReps" INTEGER,
    "maxReps" INTEGER,
    "suggestedWeightKg" DOUBLE PRECISION,
    "targetRpe" DOUBLE PRECISION,
    "restSeconds" INTEGER,
    "notes" TEXT,

    CONSTRAINT "TemplateExercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateCopy" (
    "id" TEXT NOT NULL,
    "sourceTemplateId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "copiedTemplateId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TemplateCopy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "AchievementCategory" NOT NULL,
    "icon" TEXT NOT NULL,
    "criteria" JSONB NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAchievement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "awardedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "context" JSONB,

    CONSTRAINT "UserAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminAuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "targetId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NutritionEntry_userId_consumedAt_idx" ON "NutritionEntry"("userId", "consumedAt");

-- CreateIndex
CREATE INDEX "WeightCheckIn_userId_recordedAt_idx" ON "WeightCheckIn"("userId", "recordedAt");

-- CreateIndex
CREATE INDEX "MedicalCondition_userId_status_idx" ON "MedicalCondition"("userId", "status");

-- CreateIndex
CREATE INDEX "Injury_userId_status_idx" ON "Injury"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "WorkoutTemplate_shareToken_key" ON "WorkoutTemplate"("shareToken");

-- CreateIndex
CREATE INDEX "WorkoutTemplate_ownerId_isArchived_idx" ON "WorkoutTemplate"("ownerId", "isArchived");

-- CreateIndex
CREATE INDEX "WorkoutTemplate_visibility_createdAt_idx" ON "WorkoutTemplate"("visibility", "createdAt");

-- CreateIndex
CREATE INDEX "TemplateExercise_templateId_order_idx" ON "TemplateExercise"("templateId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "TemplateCopy_copiedTemplateId_key" ON "TemplateCopy"("copiedTemplateId");

-- CreateIndex
CREATE INDEX "TemplateCopy_recipientId_createdAt_idx" ON "TemplateCopy"("recipientId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_key_key" ON "Achievement"("key");

-- CreateIndex
CREATE INDEX "UserAchievement_userId_awardedAt_idx" ON "UserAchievement"("userId", "awardedAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserAchievement_userId_achievementId_key" ON "UserAchievement"("userId", "achievementId");

-- CreateIndex
CREATE INDEX "AdminAuditLog_actorId_createdAt_idx" ON "AdminAuditLog"("actorId", "createdAt");

-- CreateIndex
CREATE INDEX "Workout_userId_date_status_idx" ON "Workout"("userId", "date", "status");

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "WorkoutTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionEntry" ADD CONSTRAINT "NutritionEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeightCheckIn" ADD CONSTRAINT "WeightCheckIn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalCondition" ADD CONSTRAINT "MedicalCondition_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Injury" ADD CONSTRAINT "Injury_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutTemplate" ADD CONSTRAINT "WorkoutTemplate_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateExercise" ADD CONSTRAINT "TemplateExercise_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "WorkoutTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateExercise" ADD CONSTRAINT "TemplateExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateCopy" ADD CONSTRAINT "TemplateCopy_sourceTemplateId_fkey" FOREIGN KEY ("sourceTemplateId") REFERENCES "WorkoutTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateCopy" ADD CONSTRAINT "TemplateCopy_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateCopy" ADD CONSTRAINT "TemplateCopy_copiedTemplateId_fkey" FOREIGN KEY ("copiedTemplateId") REFERENCES "WorkoutTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminAuditLog" ADD CONSTRAINT "AdminAuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
