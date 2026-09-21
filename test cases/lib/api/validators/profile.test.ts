import { validateProfile } from "fitness/lib/api/validators/profile";
import { describe, expect, it } from "vitest";

const validProfile = {
  firstName: "Keerthan",
  lastName: "K",
  unitSystem: "METRIC",
  fitnessGoal: "GENERAL_FITNESS",
  experienceLevel: "BEGINNER",
  weeklyWorkoutTarget: 3,
  timezone: "Asia/Kolkata",
};

describe("PROFILE-003 DES-004 workout-day target validation", () => {
  it.each([1, 7])("accepts the inclusive day target %s", (target) => {
    expect(
      validateProfile({ ...validProfile, weeklyWorkoutTarget: target }).valid,
    ).toBe(true);
  });

  it.each([
    [0, "weeklyWorkoutTarget must be at least 1"],
    [8, "weeklyWorkoutTarget must be at most 7"],
    [2.5, "weeklyWorkoutTarget must be a whole number"],
  ])("rejects %s", (target, message) => {
    const result = validateProfile({
      ...validProfile,
      weeklyWorkoutTarget: target,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual({
      field: "weeklyWorkoutTarget",
      message,
    });
  });
});
