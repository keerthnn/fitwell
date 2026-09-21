import { dateKeyInTimezone } from "fitness/lib/analytics/time";
import { resolveActivityTimezone } from "fitness/lib/workouts/activityCalendar";

const DAY_MS = 86_400_000;
const DEFAULT_TARGET = 3;

export interface WorkoutDayTargetEvent {
  daysPerWeek: number;
  effectiveAt: Date;
}

export interface WeeklyGoalInput {
  now: Date;
  timezone?: string | null;
  currentTarget?: number | null;
  targetHistory: WorkoutDayTargetEvent[];
  workoutDates: Date[];
}

export interface WeeklyGoalResult {
  workoutDaysThisWeek: number;
  weeklyWorkoutDayTarget: number;
  weeklyGoalStreak: number;
}

function normalizeTarget(value?: number | null) {
  if (!Number.isFinite(value)) return DEFAULT_TARGET;
  return Math.min(7, Math.max(1, Math.trunc(value as number)));
}

function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(dateKey: string, days: number) {
  return toDateKey(new Date(parseDateKey(dateKey).getTime() + days * DAY_MS));
}

function mondayFor(dateKey: string) {
  const daysSinceMonday = (parseDateKey(dateKey).getUTCDay() + 6) % 7;
  return addDays(dateKey, -daysSinceMonday);
}

export function calculateWeeklyGoal(input: WeeklyGoalInput): WeeklyGoalResult {
  const timezone = resolveActivityTimezone(input.timezone);
  const today = dateKeyInTimezone(input.now, timezone);
  const currentMonday = mondayFor(today);
  const completedDates = new Set(
    input.workoutDates
      .map((date) => dateKeyInTimezone(date, timezone))
      .filter((dateKey) => dateKey <= today),
  );
  const history = [...input.targetHistory].sort(
    (a, b) => a.effectiveAt.getTime() - b.effectiveAt.getTime(),
  );
  const historyWithDateKeys = history.map((event) => ({
    ...event,
    dateKey: dateKeyInTimezone(event.effectiveAt, timezone),
  }));
  const noHistoryTarget = normalizeTarget(input.currentTarget);

  const targetForWeek = (monday: string) => {
    const sunday = addDays(monday, 6);
    let applicable: WorkoutDayTargetEvent | undefined;
    for (const event of historyWithDateKeys) {
      if (event.dateKey <= sunday) applicable = event;
      else break;
    }
    return applicable
      ? normalizeTarget(applicable.daysPerWeek)
      : history.length
        ? DEFAULT_TARGET
        : noHistoryTarget;
  };
  const completedDaysForWeek = (monday: string) => {
    const sunday = addDays(monday, 6);
    let count = 0;
    for (const dateKey of completedDates) {
      if (dateKey >= monday && dateKey <= sunday) count += 1;
    }
    return count;
  };

  const workoutDaysThisWeek = completedDaysForWeek(currentMonday);
  const weeklyWorkoutDayTarget = targetForWeek(currentMonday);
  let cursor = currentMonday;
  let weeklyGoalStreak = 0;

  if (workoutDaysThisWeek < weeklyWorkoutDayTarget) {
    cursor = addDays(cursor, -7);
  }
  while (completedDaysForWeek(cursor) >= targetForWeek(cursor)) {
    weeklyGoalStreak += 1;
    cursor = addDays(cursor, -7);
  }

  return {
    workoutDaysThisWeek,
    weeklyWorkoutDayTarget,
    weeklyGoalStreak,
  };
}
