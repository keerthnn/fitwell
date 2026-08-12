export const DEFAULT_REST_SECONDS = 90;
export const REST_TIMER_STORAGE_KEY = "fitwell.restTimer";
export const REST_TIMER_STORAGE_VERSION = 1 as const;
export const REST_TIMER_COMPLETE_CUE_MS = 3_000;

export type RestTimerStatus = "running" | "paused";
export type RestTimerPauseReason = "manual" | "workout" | null;

export type RestTimer = {
  workoutId: string;
  durationSeconds: number;
  remainingSeconds: number;
  status: RestTimerStatus;
  pauseReason: RestTimerPauseReason;
  deadlineMs: number | null;
};

export function isRestTimerSurfaceVisible(
  timer: RestTimer | null,
  completionVisible: boolean,
): boolean {
  return timer !== null || completionVisible;
}

type StoredRestTimer = RestTimer & {
  version: typeof REST_TIMER_STORAGE_VERSION;
  userId: string;
};

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

type JsonObject = { [key: string]: JsonValue };

function isRecord(value: JsonValue): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPositiveInteger(value: JsonValue): value is number {
  return Number.isInteger(value) && Number(value) > 0;
}

export function normalizeRestSeconds(seconds: number): number {
  if (!Number.isFinite(seconds)) return 0;
  return Math.max(0, Math.floor(seconds));
}

export function formatRestTime(seconds: number): string {
  const normalized = normalizeRestSeconds(seconds);
  const minutes = Math.floor(normalized / 60);
  return `${minutes}:${String(normalized % 60).padStart(2, "0")}`;
}

export function getRestTimerRemaining(
  timer: RestTimer,
  nowMs: number,
): number {
  if (timer.status === "paused") return timer.remainingSeconds;
  if (timer.deadlineMs === null) return 0;
  return Math.min(
    timer.durationSeconds,
    Math.max(0, Math.ceil((timer.deadlineMs - nowMs) / 1_000)),
  );
}

export function createRestTimer(
  workoutId: string,
  seconds: number,
  nowMs: number,
): RestTimer | null {
  const durationSeconds = normalizeRestSeconds(seconds);
  if (!workoutId.trim() || durationSeconds === 0) return null;

  return {
    workoutId,
    durationSeconds,
    remainingSeconds: durationSeconds,
    status: "running",
    pauseReason: null,
    deadlineMs: nowMs + durationSeconds * 1_000,
  };
}

export function reconcileRestTimer(
  timer: RestTimer,
  nowMs: number,
): RestTimer | null {
  const remainingSeconds = getRestTimerRemaining(timer, nowMs);
  if (remainingSeconds === 0) return null;
  if (remainingSeconds === timer.remainingSeconds) return timer;
  return { ...timer, remainingSeconds };
}

export function pauseRestTimer(
  timer: RestTimer,
  reason: Exclude<RestTimerPauseReason, null>,
  nowMs: number,
): RestTimer | null {
  if (timer.status === "paused") return timer;
  const remainingSeconds = getRestTimerRemaining(timer, nowMs);
  if (remainingSeconds === 0) return null;

  return {
    ...timer,
    remainingSeconds,
    status: "paused",
    pauseReason: reason,
    deadlineMs: null,
  };
}

export function resumeRestTimer(
  timer: RestTimer,
  reason: Exclude<RestTimerPauseReason, null>,
  nowMs: number,
): RestTimer {
  if (timer.status !== "paused" || timer.pauseReason !== reason) return timer;

  return {
    ...timer,
    status: "running",
    pauseReason: null,
    deadlineMs: nowMs + timer.remainingSeconds * 1_000,
  };
}

export function addRestTimerSeconds(
  timer: RestTimer,
  seconds: number,
  nowMs: number,
): RestTimer | null {
  const additionalSeconds = normalizeRestSeconds(seconds);
  if (additionalSeconds === 0) return reconcileRestTimer(timer, nowMs);

  const reconciled = reconcileRestTimer(timer, nowMs);
  if (!reconciled) return null;

  return {
    ...reconciled,
    durationSeconds: reconciled.durationSeconds + additionalSeconds,
    remainingSeconds: reconciled.remainingSeconds + additionalSeconds,
    deadlineMs:
      reconciled.deadlineMs === null
        ? null
        : reconciled.deadlineMs + additionalSeconds * 1_000,
  };
}

export function resetRestTimer(timer: RestTimer, nowMs: number): RestTimer {
  if (timer.status === "paused" && timer.pauseReason === "workout") {
    return { ...timer, remainingSeconds: timer.durationSeconds };
  }

  return {
    ...timer,
    remainingSeconds: timer.durationSeconds,
    status: "running",
    pauseReason: null,
    deadlineMs: nowMs + timer.durationSeconds * 1_000,
  };
}

export function serializeRestTimer(timer: RestTimer, userId: string): string {
  const stored: StoredRestTimer = {
    version: REST_TIMER_STORAGE_VERSION,
    userId,
    ...timer,
  };
  return JSON.stringify(stored);
}

export function hydrateRestTimer(
  serialized: string,
  expectedUserId: string,
  nowMs: number,
): RestTimer | null {
  let value: JsonValue;
  try {
    value = JSON.parse(serialized) as JsonValue;
  } catch {
    return null;
  }

  if (
    !isRecord(value) ||
    value.version !== REST_TIMER_STORAGE_VERSION ||
    value.userId !== expectedUserId ||
    typeof value.workoutId !== "string" ||
    value.workoutId.trim() === "" ||
    !isPositiveInteger(value.durationSeconds) ||
    !isPositiveInteger(value.remainingSeconds) ||
    value.remainingSeconds > value.durationSeconds ||
    (value.status !== "running" && value.status !== "paused")
  ) {
    return null;
  }

  if (value.status === "running") {
    if (
      value.pauseReason !== null ||
      typeof value.deadlineMs !== "number" ||
      !Number.isFinite(value.deadlineMs)
    ) {
      return null;
    }
  } else if (
    (value.pauseReason !== "manual" && value.pauseReason !== "workout") ||
    value.deadlineMs !== null
  ) {
    return null;
  }

  const timer: RestTimer = {
    workoutId: value.workoutId,
    durationSeconds: value.durationSeconds,
    remainingSeconds: value.remainingSeconds,
    status: value.status,
    pauseReason: value.pauseReason,
    deadlineMs: value.deadlineMs,
  };

  return reconcileRestTimer(timer, nowMs);
}
