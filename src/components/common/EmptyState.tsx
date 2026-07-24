import { Paper, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

export default function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Paper variant="outlined" sx={{ p: 5, textAlign: "center" }}>
      <Stack alignItems="center" gap={2}>
        <Typography variant="h6">{title}</Typography>
        <Typography color="text.secondary">{description}</Typography>
        {action}
      </Stack>
    </Paper>
  );
}
