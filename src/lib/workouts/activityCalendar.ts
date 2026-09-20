import { dateKeyInTimezone } from "fitness/lib/analytics/time";

const DAY_MS = 86_400_000;
const WEEKS_IN_CALENDAR = 53;

export interface WorkoutActivityRange {
  timezone: string;
  startDate: string;
  endDate: string;
  todayDate: string;
  queryStart: Date;
  queryEnd: Date;
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

export function resolveActivityTimezone(timezone?: string | null) {
  if (!timezone) return "UTC";
  try {
    new Intl.DateTimeFormat("en-CA", { timeZone: timezone }).format(
      new Date(0),
    );
    return timezone;
  } catch {
    return "UTC";
  }
}

export function getWorkoutActivityRange(
  now: Date,
  timezone?: string | null,
): WorkoutActivityRange {
  const effectiveTimezone = resolveActivityTimezone(timezone);
  const todayDate = dateKeyInTimezone(now, effectiveTimezone);
  const utcDay = parseDateKey(todayDate).getUTCDay();
  const daysSinceMonday = (utcDay + 6) % 7;
  const currentMonday = addDays(todayDate, -daysSinceMonday);
  const startDate = addDays(
    currentMonday,
    -(WEEKS_IN_CALENDAR - 1) * 7,
  );
  const endDate = addDays(currentMonday, 6);

  return {
    timezone: effectiveTimezone,
    startDate,
    endDate,
    todayDate,
    queryStart: new Date(parseDateKey(startDate).getTime() - DAY_MS),
    queryEnd: new Date(parseDateKey(todayDate).getTime() + 2 * DAY_MS),
  };
}

export function getCompletedWorkoutDates(
  workoutDates: Date[],
  range: WorkoutActivityRange,
) {
  const completedDates = new Set<string>();

  for (const workoutDate of workoutDates) {
    const dateKey = dateKeyInTimezone(workoutDate, range.timezone);
    if (dateKey >= range.startDate && dateKey <= range.todayDate) {
      completedDates.add(dateKey);
    }
  }

  return [...completedDates].sort();
}

export function listCalendarDateKeys(startDate: string, endDate: string) {
  const keys: string[] = [];
  for (
    let cursor = startDate;
    cursor <= endDate;
    cursor = addDays(cursor, 1)
  ) {
    keys.push(cursor);
  }
  return keys;
}
