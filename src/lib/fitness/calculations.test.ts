import { describe, expect, it } from "vitest";
import { calculateStreaks, estimateWorkoutCalories, kgToLb, lbToKg, workoutVolume } from "./calculations";

describe("fitness calculations", () => {
  it("estimates calories with intensity MET values", () => {
    expect(estimateWorkoutCalories(70, 60, "MODERATE")).toBe(441);
    expect(estimateWorkoutCalories(70, 0, "VIGOROUS")).toBe(0);
  });
  it("only includes completed weighted sets in volume", () => {
    expect(workoutVolume([{ weightKg: 50, reps: 10, isCompleted: true }, { weightKg: 20, reps: 5, isCompleted: false }, { weightKg: null, reps: 10, isCompleted: true }])).toBe(500);
  });
  it("calculates current and best streak with duplicate workout days", () => {
    const now = new Date("2026-07-18T12:00:00Z");
    expect(calculateStreaks(["2026-07-14", "2026-07-15", "2026-07-15", "2026-07-17"], "UTC", now)).toEqual({ current: 1, best: 2 });
  });
  it("round-trips imperial conversion", () => {
    expect(lbToKg(kgToLb(80))).toBeCloseTo(80);
  });
});
