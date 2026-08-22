import { getContrastRatio } from "@mui/material/styles";
import { describe, expect, it } from "vitest";
import createAppTheme from "fitness/theme";

describe("sidebar theme colors", () => {
  it.each(["light", "dark"] as const)(
    "%s mode keeps sidebar hover and selected text readable",
    (mode) => {
      const sidebar = createAppTheme(mode).fitwell.colors.sidebar;

      expect(getContrastRatio(sidebar.foreground, sidebar.hover)).toBeGreaterThanOrEqual(4.5);
      expect(
        getContrastRatio(sidebar.selectedText, sidebar.selected),
      ).toBeGreaterThanOrEqual(4.5);
    },
  );

  it("uses a light sidebar surface in light mode", () => {
    const sidebar = createAppTheme("light").fitwell.colors.sidebar;

    expect(sidebar.foreground).toBe("#0F172A");
    expect(sidebar.gradient).toContain("#FFFFFF");
  });
});
