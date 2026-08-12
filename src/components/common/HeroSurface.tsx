import { Paper } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ReactNode } from "react";

export default function HeroSurface({
  children,
  tone = "neutral",
  sx = {},
}: {
  children: ReactNode;
  tone?: "neutral" | "warning";
  sx?: SxProps<Theme>;
}) {
  return (
    <Paper
      component="section"
      elevation={2}
      sx={[
        (theme) => {
          const accent = tone === "warning"
            ? theme.palette.warning.main
            : theme.fitwell.colors.border;
          const container =
            tone === "warning"
              ? theme.fitwell.colors.semantic.warning.container
              : theme.fitwell.colors.surface.secondary;
          return {
            position: "relative",
            overflow: "hidden",
            border: `1px solid ${accent}`,
            background: `linear-gradient(135deg, ${container} 0%, ${theme.palette.background.paper} 70%)`,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 22px 54px rgb(0 0 0 / 0.32)"
                : "0 20px 50px rgb(15 23 42 / 0.12)",
          };
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Paper>
  );
}
