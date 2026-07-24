import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  gender: z.string().max(40).default(""),
  age: z.number().int().min(13).max(120),
  heightCm: z.number().int().min(100).max(250),
  weightKg: z.number().positive().max(500),
  goal: z.string().trim().min(1).max(500),
  activityLevel: z
    .enum(["SEDENTARY", "LIGHTLY_ACTIVE", "MODERATELY_ACTIVE", "VERY_ACTIVE"])
    .default("MODERATELY_ACTIVE"),
  dailyCalorieTarget: z.number().int().min(500).max(10000).default(2000),
  targetWeightKg: z.number().positive().max(500).nullable().optional(),
  preferredUnits: z.enum(["METRIC", "IMPERIAL"]).default("METRIC"),
  timezone: z.string().min(1).max(100).default("UTC"),
  weeklyWorkoutTarget: z.number().int().min(1).max(14).default(3),
  preferredWorkoutDays: z
    .array(z.number().int().min(0).max(6))
    .max(7)
    .default([]),
});
