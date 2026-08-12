import { describe, expect, it } from "vitest";
import { formatCount, formatDaysPerWeek, pluralize } from "./copy";

describe("copy helpers", () => {
  it("uses singular labels only for one", () => {
    expect(pluralize(1, "exercise")).toBe("exercise");
    expect(pluralize(0, "exercise")).toBe("exercises");
    expect(pluralize(2, "exercise")).toBe("exercises");
  });

  it("formats counts and weekly frequency", () => {
    expect(formatCount(1, "set")).toBe("1 set");
    expect(formatCount(3, "set")).toBe("3 sets");
    expect(formatDaysPerWeek(1)).toBe("1 day/week");
    expect(formatDaysPerWeek(4)).toBe("4 days/week");
  });
});
