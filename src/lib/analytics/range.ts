import type { ParsedUrlQuery } from "querystring";
import type {
  AdminAnalyticsGrouping,
  AdminAnalyticsMetadata,
  AdminAnalyticsRange,
  AnalyticsPoint,
} from "fitness/utils/types";
import { z } from "zod";
import { dateKeyInTimezone } from "./time";

const rangeSchema = z.enum([
  "TODAY", "LAST_7_DAYS", "LAST_30_DAYS", "THIS_MONTH",
  "THIS_YEAR", "CUSTOM", "ALL_TIME",
]);
const groupingSchema = z.enum(["AUTO", "DAY", "WEEK", "MONTH", "YEAR"]);
const dateKeySchema = /^\d{4}-\d{2}-\d{2}$/;

export interface ResolvedAdminAnalyticsRange {
  metadata: AdminAnalyticsMetadata;
  startKey: string;
  endKey: string;
  start: Date;
  endExclusive: Date;
  bucketKeys: string[];
}

function queryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function addDays(key: string, amount: number) {
  const date = new Date(`${key}T12:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

function localDateTimeToUtc(key: string, timezone: string) {
  const [year, month, day] = key.split("-").map(Number);
  const target = Date.UTC(year, month - 1, day);
  let guess = target;
  for (let index = 0; index < 2; index += 1) {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
    }).formatToParts(new Date(guess));
    const get = (type: Intl.DateTimeFormatPartTypes) =>
      Number(parts.find((part) => part.type === type)?.value ?? 0);
    const represented = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
    guess -= represented - target;
  }
  return new Date(guess);
}

function mondayKey(key: string) {
  const date = new Date(`${key}T12:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7));
  return date.toISOString().slice(0, 10);
}

export function analyticsBucketKey(date: Date, grouping: AdminAnalyticsMetadata["grouping"], timezone: string) {
  const key = dateKeyInTimezone(date, timezone);
  if (grouping === "DAY") return key;
  if (grouping === "WEEK") return mondayKey(key);
  if (grouping === "MONTH") return key.slice(0, 7);
  return key.slice(0, 4);
}

function createBucketKeys(startKey: string, endKey: string, grouping: AdminAnalyticsMetadata["grouping"]) {
  const keys: string[] = [];
  if (grouping === "DAY") {
    for (let key = startKey; key <= endKey; key = addDays(key, 1)) keys.push(key);
  } else if (grouping === "WEEK") {
    for (let key = mondayKey(startKey); key <= endKey; key = addDays(key, 7)) keys.push(key);
  } else if (grouping === "MONTH") {
    let [year, month] = startKey.split("-").map(Number);
    const endMonth = endKey.slice(0, 7);
    while (`${year}-${String(month).padStart(2, "0")}` <= endMonth) {
      keys.push(`${year}-${String(month).padStart(2, "0")}`);
      month += 1;
      if (month === 13) { month = 1; year += 1; }
    }
  } else {
    for (let year = Number(startKey.slice(0, 4)); year <= Number(endKey.slice(0, 4)); year += 1) keys.push(String(year));
  }
  return keys;
}

function autoGrouping(dayCount: number): AdminAnalyticsMetadata["grouping"] {
  if (dayCount <= 90) return "DAY";
  if (dayCount <= 730) return "WEEK";
  if (dayCount <= 3650) return "MONTH";
  return "YEAR";
}

export function resolveAdminAnalyticsRange(
  query: ParsedUrlQuery,
  timezone: string,
  now = new Date(),
): { value?: ResolvedAdminAnalyticsRange; error?: { error: string; fieldErrors?: Record<string, string[]> } } {
  const parsedRange = rangeSchema.safeParse(queryValue(query.range) ?? "LAST_30_DAYS");
  const parsedGrouping = groupingSchema.safeParse(queryValue(query.groupBy) ?? "AUTO");
  if (!parsedRange.success || !parsedGrouping.success)
    return { error: { error: "Invalid analytics query" } };

  const range = parsedRange.data as AdminAnalyticsRange;
  const today = dateKeyInTimezone(now, timezone);
  let startKey = today;
  let endKey = today;
  if (range === "LAST_7_DAYS") startKey = addDays(today, -6);
  if (range === "LAST_30_DAYS") startKey = addDays(today, -29);
  if (range === "THIS_MONTH") startKey = `${today.slice(0, 7)}-01`;
  if (range === "THIS_YEAR") startKey = `${today.slice(0, 4)}-01-01`;
  if (range === "ALL_TIME") startKey = "1970-01-01";
  if (range === "CUSTOM") {
    const start = queryValue(query.start);
    const end = queryValue(query.end);
    if (!start || !end || !dateKeySchema.test(start) || !dateKeySchema.test(end))
      return { error: { error: "Custom range requires valid start and end dates", fieldErrors: { start: ["Use YYYY-MM-DD"], end: ["Use YYYY-MM-DD"] } } };
    startKey = start;
    endKey = end;
  }
  if (startKey > endKey) return { error: { error: "Start date must not be after end date" } };
  if (endKey > today) return { error: { error: "Analytics range cannot end in the future" } };

  const dayCount = Math.round((new Date(`${endKey}T12:00:00Z`).getTime() - new Date(`${startKey}T12:00:00Z`).getTime()) / 86400000) + 1;
  const requested = parsedGrouping.data as AdminAnalyticsGrouping;
  const grouping = requested === "AUTO" ? autoGrouping(dayCount) : requested;
  const bucketKeys = createBucketKeys(startKey, endKey, grouping);
  if (bucketKeys.length > 400)
    return { error: { error: "The selected grouping creates more than 400 data points; choose a broader grouping" } };

  const start = localDateTimeToUtc(startKey, timezone);
  const endExclusive = localDateTimeToUtc(addDays(endKey, 1), timezone);
  return { value: {
    metadata: { range, grouping, start: start.toISOString(), end: endExclusive.toISOString(), timezone },
    startKey, endKey, start, endExclusive, bucketKeys,
  } };
}

export function emptySeries(range: ResolvedAdminAnalyticsRange, fields: string[]): AnalyticsPoint[] {
  return range.bucketKeys.map((bucket) => ({
    bucket,
    label: bucket,
    ...Object.fromEntries(fields.map((field) => [field, 0])),
  }));
}

export function incrementSeries(
  points: AnalyticsPoint[],
  date: Date,
  field: string,
  grouping: AdminAnalyticsMetadata["grouping"],
  timezone: string,
  amount = 1,
) {
  const key = analyticsBucketKey(date, grouping, timezone);
  const point = points.find((item) => item.bucket === key);
  if (point) point[field] = Number(point[field] ?? 0) + amount;
}
