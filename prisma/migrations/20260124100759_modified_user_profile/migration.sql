/*
  Warnings:

  - Made the column `age` on table `UserProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gender` on table `UserProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `heightCm` on table `UserProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `weightKg` on table `UserProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `goal` on table `UserProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UserProfile" ALTER COLUMN "age" SET NOT NULL,
ALTER COLUMN "gender" SET NOT NULL,
ALTER COLUMN "heightCm" SET NOT NULL,
ALTER COLUMN "weightKg" SET NOT NULL,
ALTER COLUMN "goal" SET NOT NULL;
