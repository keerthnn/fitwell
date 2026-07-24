import { alpha, createTheme, type PaletteMode } from "@mui/material/styles";

export default function createAppTheme(mode: PaletteMode) {
  const dark = mode === "dark";
  return createTheme({
    palette: {
      mode,
      primary: {
        main: dark ? "#60a5fa" : "#2563eb",
        light: "#93c5fd",
        dark: "#1e40af",
        contrastText: dark ? "#0f172a" : "#ffffff",
      },
      secondary: {
        main: dark ? "#34d399" : "#10b981",
        light: "#6ee7b7",
        dark: "#059669",
        contrastText: "#052e2b",
      },
      success: { main: dark ? "#34d399" : "#10b981" },
      error: { main: dark ? "#f87171" : "#ef4444" },
      warning: { main: dark ? "#fbbf24" : "#f59e0b" },
      info: { main: dark ? "#60a5fa" : "#3b82f6" },
      background: {
        default: dark ? "#020408" : "#f8fafc",
        paper: dark ? "#080a0d" : "#ffffff",
      },
      text: dark
        ? { primary: "#f1f5f9", secondary: "#94a3b8", disabled: "#64748b" }
        : { primary: "#0f172a", secondary: "#64748b", disabled: "#cbd5e1" },
      divider: dark ? "#26292e" : "#e2e8f0",
    },
    typography: {
      fontFamily: "var(--font-roboto)",
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
              outline: "2px solid",
              outlineColor: "primary.main",
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
          outlined: {
            borderWidth: 2,
            "&:hover": {
              borderWidth: 2,
              backgroundColor: alpha(dark ? "#60a5fa" : "#2563eb", 0.08),
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
            "& .MuiOutlinedInput-root": {
              borderRadius: 8,
              backgroundColor: dark ? "#080a0d" : "#ffffff",
              transition: "all 0.2s ease-in-out",
              "&:hover": { backgroundColor: dark ? "#101216" : "#f8fafc" },
              "&.Mui-focused": {
                backgroundColor: dark ? "#080a0d" : "#ffffff",
                "& .MuiOutlinedInput-notchedOutline": { borderWidth: 2 },
              },
            },
            "& .MuiInputLabel-root": { fontWeight: 500 },
          },
        },
      },
      MuiSelect: {
        defaultProps: { variant: "outlined" },
        styleOverrides: {
          root: {
            borderRadius: 8,
            backgroundColor: dark ? "#080a0d" : "#ffffff",
            "&:hover": { backgroundColor: dark ? "#101216" : "#f8fafc" },
            "&.Mui-focused": { backgroundColor: dark ? "#080a0d" : "#ffffff" },
          },
        },
      },
      MuiAppBar: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundColor: dark ? "#020408" : "#ffffff",
            color: dark ? "#f1f5f9" : "#0f172a",
            borderBottom: `1px solid ${dark ? "#26292e" : "#e2e8f0"}`,
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
            border: `1px solid ${dark ? "#26292e" : "#e2e8f0"}`,
            backgroundImage: "none",
          },
          elevation1: { boxShadow: "0 1px 3px rgb(0 0 0 / 0.14)" },
          elevation2: { boxShadow: "0 4px 10px rgb(0 0 0 / 0.16)" },
          elevation3: { boxShadow: "0 10px 20px rgb(0 0 0 / 0.2)" },
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
              outline: `2px solid ${dark ? "#60a5fa" : "#2563eb"}`,
              outlineOffset: -3,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 999, fontWeight: 600 },
        },
      },
    },
  });
}
