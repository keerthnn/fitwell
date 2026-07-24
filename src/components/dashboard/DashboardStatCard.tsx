import type { SvgIconProps } from "@mui/material";
import { Box, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import type { ReactElement } from "react";

type Tone = "primary" | "success" | "warning" | "info";

export default function DashboardStatCard({
  icon,
  label,
  value,
  helper,
  tone,
  progress,
}: {
  icon: ReactElement<SvgIconProps>;
  label: string;
  value: string | number;
  helper: string;
  tone: Tone;
  progress?: number;
}) {
  const toneStyles = (theme: Theme) => {
    const semantic =
      tone === "primary"
        ? {
            background: theme.fitwell.colors.interaction.primaryContainer,
            foreground: theme.fitwell.colors.interaction.onPrimaryContainer,
          }
        : {
            background: theme.fitwell.colors.semantic[tone].container,
            foreground: theme.fitwell.colors.semantic[tone].onContainer,
          };
    return {
      bgcolor: semantic.background,
      color: semantic.foreground,
    };
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 1.75, sm: 2.25 },
        height: "100%",
        minHeight: { xs: 136, sm: 164 },
      }}
    >
      <Stack direction="row" gap={1.5} alignItems="flex-start">
        <Box
          sx={[
            {
              display: { xs: "none", sm: "grid" },
              placeItems: "center",
              width: 52,
              height: 52,
              flex: "0 0 auto",
              borderRadius: "50%",
              "& .MuiSvgIcon-root": { fontSize: 29 },
            },
            toneStyles,
          ]}
        >
          {icon}
        </Box>
        <Box minWidth={0}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.3 }}
          >
            {label}
          </Typography>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{ mt: 0.5, fontSize: { xs: "1.75rem", sm: "2rem" } }}
          >
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {helper}
          </Typography>
        </Box>
      </Stack>
      {progress !== undefined && (
        <LinearProgress
          variant="determinate"
          value={Math.min(Math.max(progress, 0), 100)}
          sx={{
            mt: 2,
            height: 8,
            borderRadius: 999,
            bgcolor: (theme) => theme.fitwell.colors.surface.secondary,
            "& .MuiLinearProgress-bar": { borderRadius: 999 },
          }}
        />
      )}
    </Paper>
  );
}
