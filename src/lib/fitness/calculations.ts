export type Intensity = "LIGHT" | "MODERATE" | "VIGOROUS";

const MET: Record<Intensity, number> = { LIGHT: 3.5, MODERATE: 6, VIGOROUS: 8 };

export function estimateWorkoutCalories(
  weightKg: number,
  durationMinutes: number,
  intensity: Intensity,
) {
  if (weightKg <= 0 || durationMinutes <= 0) return 0;
  return Math.round((MET[intensity] * 3.5 * weightKg * durationMinutes) / 200);
}

export function workoutVolume(
  sets: Array<{
    weightKg: number | null;
    reps: number | null;
    isCompleted?: boolean;
  }>,
) {
  return sets.reduce(
    (total, set) =>
      total +
      (set.isCompleted !== false ? (set.weightKg ?? 0) * (set.reps ?? 0) : 0),
    0,
  );
}

export function localDateKey(date: Date | string, timezone = "UTC") {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(date));
  } catch {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(date));
  }
}

function addDays(key: string, days: number) {
  const date = new Date(`${key}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function calculateStreaks(
  dates: Array<Date | string>,
  timezone = "UTC",
  now = new Date(),
) {
  const keys = [
    ...new Set(dates.map((date) => localDateKey(date, timezone))),
  ].sort();
  let best = 0;
  let run = 0;
  let previous = "";
  for (const key of keys) {
    run = previous && addDays(previous, 1) === key ? run + 1 : 1;
    best = Math.max(best, run);
    previous = key;
  }
  const today = localDateKey(now, timezone);
  const yesterday = addDays(today, -1);
  let current = 0;
  let cursor = keys.includes(today)
    ? today
    : keys.includes(yesterday)
      ? yesterday
      : "";
  const set = new Set(keys);
  while (cursor && set.has(cursor)) {
    current += 1;
    cursor = addDays(cursor, -1);
  }
  return { current, best };
}

export function kgToLb(kg: number) {
  return kg * 2.2046226218;
}
export function lbToKg(lb: number) {
  return lb / 2.2046226218;
}
