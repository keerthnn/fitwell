import { primaryNavigation } from "fitness/components/layout/navigation";
import { describe, expect, it } from "vitest";

describe("Member navigation", () => {
  it("PROFILE-004 exposes Profile without a separate Settings destination", () => {
    expect(primaryNavigation).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "Profile", href: "/profile" }),
      ]),
    );
    expect(primaryNavigation).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ href: "/settings" })]),
    );
  });
});
