-- CreateTable
CREATE TABLE "UserActivityDay" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activityDate" DATE NOT NULL,
    "firstActiveAt" TIMESTAMP(3) NOT NULL,
    "lastActiveAt" TIMESTAMP(3) NOT NULL,
    "requestCount" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "UserActivityDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateUseEvent" (
    "id" TEXT NOT NULL,
    "templateId" TEXT,
    "templateTitleSnapshot" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TemplateUseEvent_pkey" PRIMARY KEY ("id")
);

-- Best-effort activity history from the only pre-existing activity timestamp.
INSERT INTO "UserActivityDay" ("id", "userId", "activityDate", "firstActiveAt", "lastActiveAt", "requestCount")
SELECT md5('activity:' || "id" || ':' || "updatedAt"::date::text), "id", "updatedAt"::date, "updatedAt", "updatedAt", 1
FROM "User";

-- Preserve existing template starts as historical use events.
INSERT INTO "TemplateUseEvent" ("id", "templateId", "templateTitleSnapshot", "createdAt")
SELECT md5('template-use:' || w."id"), w."templateId", t."title", w."createdAt"
FROM "Workout" w
JOIN "WorkoutTemplate" t ON t."id" = w."templateId"
WHERE w."templateId" IS NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserActivityDay_userId_activityDate_key" ON "UserActivityDay"("userId", "activityDate");
CREATE INDEX "UserActivityDay_activityDate_idx" ON "UserActivityDay"("activityDate");
CREATE INDEX "TemplateUseEvent_createdAt_idx" ON "TemplateUseEvent"("createdAt");
CREATE INDEX "TemplateUseEvent_templateId_createdAt_idx" ON "TemplateUseEvent"("templateId", "createdAt");
CREATE INDEX "TemplateCopy_createdAt_idx" ON "TemplateCopy"("createdAt");
CREATE INDEX "UserAchievement_awardedAt_idx" ON "UserAchievement"("awardedAt");

-- AddForeignKey
ALTER TABLE "UserActivityDay" ADD CONSTRAINT "UserActivityDay_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TemplateUseEvent" ADD CONSTRAINT "TemplateUseEvent_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "WorkoutTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
