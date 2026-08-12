import { describe, expect, it } from "vitest";
import {
  addRestTimerSeconds,
  createRestTimer,
  DEFAULT_REST_SECONDS,
  formatRestTime,
  hydrateRestTimer,
  isRestTimerSurfaceVisible,
  pauseRestTimer,
  reconcileRestTimer,
  resetRestTimer,
  resumeRestTimer,
  serializeRestTimer,
} from "./restTimer";

const NOW = 1_800_000_000_000;

describe("rest timer helpers", () => {
  it("provides and formats the 90-second fallback", () => {
    expect(DEFAULT_REST_SECONDS).toBe(90);
    expect(formatRestTime(DEFAULT_REST_SECONDS)).toBe("1:30");
    expect(formatRestTime(5)).toBe("0:05");
    expect(formatRestTime(-1)).toBe("0:00");
  });

  it("keeps layout space reserved through the completion cue", () => {
    const timer = createRestTimer("workout-1", 90, NOW)!;
    expect(isRestTimerSurfaceVisible(timer, false)).toBe(true);
    expect(isRestTimerSurfaceVisible(null, true)).toBe(true);
    expect(isRestTimerSurfaceVisible(null, false)).toBe(false);
  });

  it("creates a deadline timer and treats zero as no timer", () => {
    expect(createRestTimer("workout-1", 0, NOW)).toBeNull();
    expect(createRestTimer("workout-1", 90.9, NOW)).toEqual({
      workoutId: "workout-1",
      durationSeconds: 90,
      remainingSeconds: 90,
      status: "running",
      pauseReason: null,
      deadlineMs: NOW + 90_000,
    });
  });

  it("reconciles running timers against their deadline", () => {
    const timer = createRestTimer("workout-1", 90, NOW)!;
    expect(reconcileRestTimer(timer, NOW + 10_001)?.remainingSeconds).toBe(80);
    expect(reconcileRestTimer(timer, NOW + 90_000)).toBeNull();
    expect(reconcileRestTimer(timer, NOW - 10_000)?.remainingSeconds).toBe(90);
  });

  it("keeps manual and workout pauses distinct", () => {
    const timer = createRestTimer("workout-1", 90, NOW)!;
    const manual = pauseRestTimer(timer, "manual", NOW + 20_000)!;
    expect(manual).toMatchObject({
      remainingSeconds: 70,
      status: "paused",
      pauseReason: "manual",
      deadlineMs: null,
    });
    expect(resumeRestTimer(manual, "workout", NOW + 30_000)).toBe(manual);
    expect(resumeRestTimer(manual, "manual", NOW + 30_000)).toMatchObject({
      status: "running",
      pauseReason: null,
      deadlineMs: NOW + 100_000,
    });

    const workoutPaused = pauseRestTimer(timer, "workout", NOW + 20_000)!;
    expect(resumeRestTimer(workoutPaused, "manual", NOW + 30_000)).toBe(
      workoutPaused,
    );
    expect(resumeRestTimer(workoutPaused, "workout", NOW + 30_000).status).toBe(
      "running",
    );
  });

  it("extends both the active session duration and remaining deadline", () => {
    const running = createRestTimer("workout-1", 90, NOW)!;
    expect(addRestTimerSeconds(running, 30, NOW + 20_000)).toMatchObject({
      durationSeconds: 120,
      remainingSeconds: 100,
      deadlineMs: NOW + 120_000,
    });

    const paused = pauseRestTimer(running, "manual", NOW + 20_000)!;
    expect(addRestTimerSeconds(paused, 30, NOW + 40_000)).toMatchObject({
      durationSeconds: 120,
      remainingSeconds: 100,
      deadlineMs: null,
    });
  });

  it("resets manual timers to running but keeps workout-paused timers frozen", () => {
    const timer = createRestTimer("workout-1", 90, NOW)!;
    const manual = pauseRestTimer(timer, "manual", NOW + 20_000)!;
    expect(resetRestTimer(manual, NOW + 30_000)).toMatchObject({
      remainingSeconds: 90,
      status: "running",
      pauseReason: null,
      deadlineMs: NOW + 120_000,
    });

    const workoutPaused = pauseRestTimer(timer, "workout", NOW + 20_000)!;
    expect(resetRestTimer(workoutPaused, NOW + 30_000)).toMatchObject({
      remainingSeconds: 90,
      status: "paused",
      pauseReason: "workout",
      deadlineMs: null,
    });
  });

  it("round-trips a user-associated versioned snapshot", () => {
    const timer = createRestTimer("workout-1", 90, NOW)!;
    const stored = serializeRestTimer(timer, "user-1");
    expect(JSON.parse(stored)).toMatchObject({
      version: 1,
      userId: "user-1",
      workoutId: "workout-1",
    });
    expect(hydrateRestTimer(stored, "user-1", NOW + 20_000)).toMatchObject({
      workoutId: "workout-1",
      remainingSeconds: 70,
    });
  });

  it("discards corrupt, legacy, wrong-user, and expired snapshots", () => {
    const timer = createRestTimer("workout-1", 90, NOW)!;
    const stored = serializeRestTimer(timer, "user-1");

    expect(hydrateRestTimer("not-json", "user-1", NOW)).toBeNull();
    expect(hydrateRestTimer(JSON.stringify(timer), "user-1", NOW)).toBeNull();
    expect(hydrateRestTimer(stored, "user-2", NOW)).toBeNull();
    expect(hydrateRestTimer(stored, "user-1", NOW + 90_000)).toBeNull();
    expect(
      hydrateRestTimer(
        JSON.stringify({
          ...JSON.parse(stored),
          remainingSeconds: 91,
        }),
        "user-1",
        NOW,
      ),
    ).toBeNull();
  });
});
