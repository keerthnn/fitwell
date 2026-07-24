import createAppTheme from "fitness/theme";
import { describe, expect, it } from "vitest";

describe("FitWell color system", () => {
  it("exposes the canonical light theme", () => {
    const theme = createAppTheme("light");

    expect(theme.palette.background).toMatchObject({
      default: "#F5F7FA",
      paper: "#FFFFFF",
    });
    expect(theme.fitwell.colors.surface).toEqual({
      secondary: "#EEF2F7",
      elevated: "#FCFDFE",
    });
    expect(theme.palette.primary).toMatchObject({
      main: "#2563EB",
      dark: "#1D4ED8",
    });
    expect(theme.palette.secondary.main).toBe("#64748B");
    expect(theme.fitwell.colors.interaction).toEqual({
      primaryHover: "#1D4ED8",
      primaryActive: "#1E40AF",
      primaryContainer: "#DBEAFE",
      onPrimaryContainer: "#1D4ED8",
    });
    expect(theme.palette.success.main).toBe("#16A34A");
    expect(theme.palette.warning.main).toBe("#F59E0B");
    expect(theme.palette.error.main).toBe("#DC2626");
    expect(theme.palette.info.main).toBe("#2563EB");
    expect(theme.fitwell.colors.semantic).toEqual({
      success: { container: "#DCFCE7", onContainer: "#166534" },
      warning: { container: "#FEF3C7", onContainer: "#B45309" },
      error: { container: "#FEE2E2", onContainer: "#B91C1C" },
      info: { container: "#DBEAFE", onContainer: "#1D4ED8" },
    });
    expect(theme.palette.text).toMatchObject({
      primary: "#0F172A",
      secondary: "#64748B",
      disabled: "#94A3B8",
    });
    expect(theme.fitwell.colors.border).toBe("#E2E8F0");
    expect(theme.palette.divider).toBe("#CBD5E1");
  });

  it("exposes the canonical dark theme", () => {
    const theme = createAppTheme("dark");

    expect(theme.palette.background).toMatchObject({
      default: "#04070C",
      paper: "#0C1117",
    });
    expect(theme.fitwell.colors.surface).toEqual({
      secondary: "#090E14",
      elevated: "#131A22",
    });
    expect(theme.palette.primary).toMatchObject({
      main: "#3B82F6",
      light: "#60A5FA",
      dark: "#2563EB",
    });
    expect(theme.palette.secondary.main).toBe("#94A3B8");
    expect(theme.fitwell.colors.interaction).toEqual({
      primaryHover: "#60A5FA",
      primaryActive: "#2563EB",
      primaryContainer: "#1E3A8A",
      onPrimaryContainer: "#F8FAFC",
    });
    expect(theme.palette.success.main).toBe("#22C55E");
    expect(theme.palette.warning.main).toBe("#FBBF24");
    expect(theme.palette.error.main).toBe("#F87171");
    expect(theme.palette.info.main).toBe("#3B82F6");
    expect(theme.fitwell.colors.semantic).toEqual({
      success: { container: "#14532D", onContainer: "#F8FAFC" },
      warning: { container: "#78350F", onContainer: "#F8FAFC" },
      error: { container: "#7F1D1D", onContainer: "#F8FAFC" },
      info: { container: "#1E3A8A", onContainer: "#F8FAFC" },
    });
    expect(theme.palette.text).toMatchObject({
      primary: "#F8FAFC",
      secondary: "#94A3B8",
      disabled: "#64748B",
    });
    expect(theme.fitwell.colors.border).toBe("#27303A");
    expect(theme.palette.divider).toBe("#1C2430");
  });

  it("keeps shared navigation, focus, and chart tokens stable", () => {
    const colors = createAppTheme("light").fitwell.colors;

    expect(colors.focus).toBe("#2563EB");
    expect(colors.sidebar).toEqual({
      start: "#0F172A",
      middle: "#111827",
      end: "#0B1220",
      gradient:
        "linear-gradient(180deg, #0F172A 0%, #111827 50%, #0B1220 100%)",
      selected: "#1E3A8A",
      selectedText: "#F8FAFC",
    });
    expect(colors.chart).toEqual([
      "#2563EB",
      "#16A34A",
      "#F59E0B",
      "#64748B",
      "#DC2626",
    ]);
  });
});
