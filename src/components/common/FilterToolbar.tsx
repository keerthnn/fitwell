import { Paper, Stack } from "@mui/material";
import type { ReactNode } from "react";

export default function FilterToolbar({ children }: { children: ReactNode }) {
  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
      <Stack direction={{ xs: "column", sm: "row" }} gap={2}>{children}</Stack>
    </Paper>
  );
}
