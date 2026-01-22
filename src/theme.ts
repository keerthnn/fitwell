import { createTheme } from "@mui/material/styles";

const appTheme = createTheme({
  typography: {
    fontFamily: "var(--font-roboto)",
  },
  palette: {
    primary: {
      main: "#1e40af",
      contrastText: "#ffffff",
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: "contained",
        color: "primary",
      },
      styleOverrides: {
        root: {
          borderRadius: "6px",
          textTransform: "none",
          fontWeight: 500,
          gap: "8px",
          whiteSpace: "nowrap",
          "&:focus-visible": {
            outline: "1px solid",
            outlineColor: "primary.main",
            outlineOffset: "2px",
          },
          "&:disabled": {
            pointerEvents: "none",
            opacity: 0.5,
          },
          "& svg": {
            pointerEvents: "none",
            fontSize: "1rem",
            flexShrink: 0,
          },
        },
      },
    },
  },
});

export default appTheme;
