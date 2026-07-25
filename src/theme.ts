import { createTheme, type PaletteMode } from "@mui/material/styles";

export default function createAppTheme(mode: PaletteMode) {
  const dark = mode === "dark";
  const colors = {
    surface: {
      secondary: dark ? "#090E14" : "#EEF2F7",
      elevated: dark ? "#131A22" : "#FCFDFE",
    },
    border: dark ? "#27303A" : "#E2E8F0",
    focus: "#2563EB",
    interaction: {
      primaryHover: dark ? "#60A5FA" : "#1D4ED8",
      primaryActive: dark ? "#2563EB" : "#1E40AF",
      primaryContainer: dark ? "#1E3A8A" : "#DBEAFE",
      onPrimaryContainer: dark ? "#F8FAFC" : "#1D4ED8",
    },
    semantic: {
      success: {
        container: dark ? "#14532D" : "#DCFCE7",
        onContainer: dark ? "#F8FAFC" : "#166534",
      },
      warning: {
        container: dark ? "#78350F" : "#FEF3C7",
        onContainer: dark ? "#F8FAFC" : "#B45309",
      },
      error: {
        container: dark ? "#7F1D1D" : "#FEE2E2",
        onContainer: dark ? "#F8FAFC" : "#B91C1C",
      },
      info: {
        container: dark ? "#1E3A8A" : "#DBEAFE",
        onContainer: dark ? "#F8FAFC" : "#1D4ED8",
      },
    },
    sidebar: {
      start: "#0F172A",
      middle: "#111827",
      end: "#0B1220",
      gradient:
        "linear-gradient(180deg, #0F172A 0%, #111827 50%, #0B1220 100%)",
      selected: "#1E3A8A",
      selectedText: "#F8FAFC",
    },
    chart: ["#2563EB", "#16A34A", "#F59E0B", "#64748B", "#DC2626"],
  };

  return createTheme({
    palette: {
      mode,
      primary: {
        main: dark ? "#3B82F6" : "#2563EB",
        light: dark ? "#60A5FA" : "#DBEAFE",
        dark: dark ? "#2563EB" : "#1D4ED8",
        contrastText: "#FFFFFF",
      },
      secondary: {
        main: dark ? "#94A3B8" : "#64748B",
        light: dark ? "#CBD5E1" : "#94A3B8",
        dark: "#64748B",
        contrastText: dark ? "#04070C" : "#FFFFFF",
      },
      success: {
        main: dark ? "#22C55E" : "#16A34A",
        contrastText: dark ? "#04070C" : "#FFFFFF",
      },
      error: {
        main: dark ? "#F87171" : "#DC2626",
        contrastText: dark ? "#04070C" : "#FFFFFF",
      },
      warning: {
        main: dark ? "#FBBF24" : "#F59E0B",
        contrastText: dark ? "#04070C" : "#0F172A",
      },
      info: {
        main: dark ? "#3B82F6" : "#2563EB",
        contrastText: "#FFFFFF",
      },
      background: {
        default: dark ? "#04070C" : "#F5F7FA",
        paper: dark ? "#0C1117" : "#FFFFFF",
      },
      text: dark
        ? { primary: "#F8FAFC", secondary: "#94A3B8", disabled: "#64748B" }
        : { primary: "#0F172A", secondary: "#64748B", disabled: "#94A3B8" },
      divider: dark ? "#1C2430" : "#CBD5E1",
      action: {
        active: dark ? "#F8FAFC" : "#0F172A",
        hover: colors.surface.secondary,
        selected: colors.interaction.primaryContainer,
        disabled: dark ? "#64748B" : "#94A3B8",
        disabledBackground: colors.surface.secondary,
        focus: colors.interaction.primaryContainer,
      },
    },
    typography: {
      fontFamily:
        'var(--font-roboto, "Inter"), "Helvetica Neue", Arial, sans-serif',
      h3: {
        fontSize: "2.5rem",
        fontWeight: 700,
        letterSpacing: "-0.02em",
        lineHeight: 1.2,
      },
      h4: {
        fontSize: "2rem",
        fontWeight: 600,
        letterSpacing: "-0.01em",
        lineHeight: 1.3,
      },
      h5: { fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.4 },
      h6: { fontSize: "1.25rem", fontWeight: 600, lineHeight: 1.4 },
      body1: { fontSize: "1rem", lineHeight: 1.6 },
      body2: { fontSize: "0.875rem", lineHeight: 1.5 },
      button: { fontWeight: 600, letterSpacing: "0.02em" },
    },
    shape: { borderRadius: 8 },
    fitwell: {
      sidebarWidth: 264,
      sidebarCollapsedWidth: 80,
      mobileNavigationHeight: 72,
      contentMaxWidth: 1440,
      cardRadius: 16,
      buttonRadius: 12,
      imageRatios: { card: "16 / 10", cover: "3 / 2" },
      colors,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          "html, body, #__next": {
            width: "100%",
            maxWidth: "100%",
            overflowX: "hidden",
          },
          "*, *::before, *::after": { boxSizing: "border-box" },
          "*:focus-visible": {
            outline: `2px solid ${colors.focus}`,
            outlineOffset: "2px",
          },
          a: {
            color: "inherit",
            textDecoration: "none",
          },
          img: { maxWidth: "100%" },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.9375rem",
            padding: "10px 24px",
            transition: "all 0.2s ease-in-out",
            "&:focus-visible": {
              outline: `2px solid ${colors.focus}`,
              outlineOffset: "2px",
            },
          },
          contained: {
            boxShadow: "none",
            "&:hover": {
              boxShadow: "0 4px 10px rgb(0 0 0 / 0.18)",
              transform: "translateY(-1px)",
            },
            "&:active": { transform: "translateY(0)" },
          },
          containedPrimary: {
            backgroundColor: dark ? "#3B82F6" : "#2563EB",
            color: "#FFFFFF",
            "&:hover": {
              backgroundColor: colors.interaction.primaryHover,
            },
            "&:active": {
              backgroundColor: colors.interaction.primaryActive,
            },
          },
          containedSuccess: {
            color: dark ? "#04070C" : "#FFFFFF",
          },
          containedError: {
            color: dark ? "#04070C" : "#FFFFFF",
          },
          outlinedPrimary: {
            borderWidth: 1,
            borderColor: dark ? "#1C2430" : "#CBD5E1",
            color: dark ? "#F8FAFC" : "#0F172A",
            "&:hover": {
              borderWidth: 1,
              borderColor: dark ? "#1C2430" : "#CBD5E1",
              backgroundColor: colors.surface.secondary,
            },
            "&:active": {
              backgroundColor: colors.surface.elevated,
            },
          },
          sizeLarge: { padding: "12px 32px", fontSize: "1rem" },
          sizeSmall: { padding: "6px 16px", fontSize: "0.875rem" },
        },
      },
      MuiTextField: {
        defaultProps: { variant: "outlined", fullWidth: true },
        styleOverrides: {
          root: {
            "& .MuiInputLabel-root": { fontWeight: 500 },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            backgroundColor: dark ? "#0C1117" : "#FFFFFF",
            transition: "background-color 0.2s ease-in-out",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: colors.border,
            },
            "&:hover": {
              backgroundColor: colors.surface.elevated,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: dark ? "#1C2430" : "#CBD5E1",
              },
            },
            "&.Mui-focused": {
              backgroundColor: dark ? "#0C1117" : "#FFFFFF",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: dark ? "#3B82F6" : "#2563EB",
                borderWidth: 2,
              },
            },
          },
        },
      },
      MuiSelect: {
        defaultProps: { variant: "outlined" },
      },
      MuiAppBar: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundColor: colors.surface.elevated,
            color: dark ? "#F8FAFC" : "#0F172A",
            borderBottom: `1px solid ${colors.border}`,
          },
        },
      },
      MuiContainer: {
        styleOverrides: {
          root: {
            maxWidth: "100%",
            paddingLeft: 24,
            paddingRight: 24,
            "@media (max-width:600px)": { paddingLeft: 16, paddingRight: 16 },
          },
        },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: `1px solid ${colors.border}`,
            backgroundColor: dark ? "#0C1117" : "#FFFFFF",
            backgroundImage: "none",
          },
          elevation1: { boxShadow: "0 1px 3px rgb(0 0 0 / 0.14)" },
          elevation2: { boxShadow: "0 4px 10px rgb(0 0 0 / 0.16)" },
          elevation3: { boxShadow: "0 10px 20px rgb(0 0 0 / 0.2)" },
        },
      },
      MuiPopover: {
        styleOverrides: {
          paper: {
            backgroundColor: colors.surface.elevated,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: colors.surface.elevated,
          },
        },
      },
      MuiFormControl: {
        styleOverrides: {
          root: { "& .MuiInputLabel-root": { fontWeight: 500 } },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            borderColor: colors.border,
            backgroundColor: dark ? "#0C1117" : "#FFFFFF",
            backgroundImage: "none",
            boxShadow: dark
              ? "0 18px 45px rgb(0 0 0 / 0.18)"
              : "0 14px 36px rgb(15 23 42 / 0.06)",
          },
        },
      },
      MuiBottomNavigationAction: {
        styleOverrides: {
          root: {
            minWidth: 56,
            minHeight: 64,
            "&:focus-visible": {
              outline: `2px solid ${colors.focus}`,
              outlineOffset: -3,
            },
            "&.Mui-selected": {
              color: dark ? "#3B82F6" : "#2563EB",
            },
          },
        },
      },
      MuiBottomNavigation: {
        styleOverrides: {
          root: {
            backgroundColor: colors.surface.elevated,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            "&.Mui-selected": {
              backgroundColor: colors.interaction.primaryContainer,
              color: colors.interaction.onPrimaryContainer,
              "&:hover": {
                backgroundColor: colors.interaction.primaryContainer,
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            fontWeight: 600,
            backgroundColor: colors.surface.secondary,
            color: dark ? "#94A3B8" : "#64748B",
          },
          colorPrimary: {
            backgroundColor: colors.interaction.primaryContainer,
            color: colors.interaction.onPrimaryContainer,
          },
          colorSuccess: {
            backgroundColor: colors.semantic.success.container,
            color: colors.semantic.success.onContainer,
          },
          colorWarning: {
            backgroundColor: colors.semantic.warning.container,
            color: colors.semantic.warning.onContainer,
          },
          colorError: {
            backgroundColor: colors.semantic.error.container,
            color: colors.semantic.error.onContainer,
          },
          colorInfo: {
            backgroundColor: colors.semantic.info.container,
            color: colors.semantic.info.onContainer,
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          standardSuccess: {
            backgroundColor: colors.semantic.success.container,
            color: colors.semantic.success.onContainer,
          },
          standardWarning: {
            backgroundColor: colors.semantic.warning.container,
            color: colors.semantic.warning.onContainer,
          },
          standardError: {
            backgroundColor: colors.semantic.error.container,
            color: colors.semantic.error.onContainer,
          },
          standardInfo: {
            backgroundColor: colors.semantic.info.container,
            color: colors.semantic.info.onContainer,
          },
        },
      },
    },
  });
}
