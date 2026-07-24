import { describe, expect, it } from "vitest";
import { canonicalHeight, canonicalWeight, displayHeight, displayWeight } from "./units";

describe("unit conversion", () => {
  it("round-trips canonical metric values", () => {
    expect(canonicalWeight(displayWeight(80, "IMPERIAL"), "IMPERIAL")).toBeCloseTo(80);
    expect(canonicalHeight(displayHeight(180, "IMPERIAL"), "IMPERIAL")).toBeCloseTo(180);
  });
});
