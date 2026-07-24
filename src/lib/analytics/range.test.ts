import { describe, expect, it } from "vitest";
import { analyticsBucketKey, emptySeries, incrementSeries, resolveAdminAnalyticsRange } from "./range";

describe("admin analytics date ranges", () => {
  it("uses the administrator timezone for Today", () => {
    const result = resolveAdminAnalyticsRange(
      { range: "TODAY" },
      "Asia/Kolkata",
      new Date("2024-02-29T19:00:00.000Z"),
    ).value!;
    expect(result.startKey).toBe("2024-03-01");
    expect(result.metadata.start).toBe("2024-02-29T18:30:00.000Z");
    expect(result.metadata.end).toBe("2024-03-01T18:30:00.000Z");
  });

  it("includes leap day in a custom daily range", () => {
    const result = resolveAdminAnalyticsRange(
      { range: "CUSTOM", start: "2024-02-28", end: "2024-03-01", groupBy: "DAY" },
      "UTC",
      new Date("2024-03-10T00:00:00Z"),
    ).value!;
    expect(result.bucketKeys).toEqual(["2024-02-28", "2024-02-29", "2024-03-01"]);
  });

  it("uses Monday as the weekly bucket boundary", () => {
    expect(analyticsBucketKey(new Date("2024-03-10T12:00:00Z"), "WEEK", "UTC")).toBe("2024-03-04");
  });

  it("rejects reversed and future custom ranges", () => {
    expect(resolveAdminAnalyticsRange(
      { range: "CUSTOM", start: "2024-03-02", end: "2024-03-01" }, "UTC", new Date("2024-03-10T00:00:00Z"),
    ).error?.error).toContain("Start date");
    expect(resolveAdminAnalyticsRange(
      { range: "CUSTOM", start: "2024-03-01", end: "2024-03-11" }, "UTC", new Date("2024-03-10T00:00:00Z"),
    ).error?.error).toContain("future");
  });

  it("rejects explicit groupings above 400 buckets", () => {
    expect(resolveAdminAnalyticsRange(
      { range: "CUSTOM", start: "2020-01-01", end: "2024-01-01", groupBy: "DAY" },
      "UTC", new Date("2025-01-01T00:00:00Z"),
    ).error?.error).toContain("400");
  });

  it("fills and increments backend-aggregated series", () => {
    const range = resolveAdminAnalyticsRange(
      { range: "CUSTOM", start: "2024-03-01", end: "2024-03-03", groupBy: "DAY" },
      "UTC", new Date("2024-03-10T00:00:00Z"),
    ).value!;
    const series = emptySeries(range, ["events"]);
    incrementSeries(series, new Date("2024-03-02T12:00:00Z"), "events", "DAY", "UTC", 3);
    expect(series.map((point) => point.events)).toEqual([0, 3, 0]);
  });
});
