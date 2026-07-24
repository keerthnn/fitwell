import { Box, Paper } from "@mui/material";
import type { ReactNode } from "react";

export default function FilterToolbar({ children }: { children: ReactNode }) {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 1.5, sm: 2 }, mb: 3 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            sm: "repeat(2, minmax(0, 1fr))",
            md: "repeat(auto-fit, minmax(180px, 1fr))",
          },
          gap: { xs: 1.5, sm: 2 },
          alignItems: "start",
          "& > *": { minWidth: 0 },
        }}
      >
        {children}
      </Box>
    </Paper>
  );
}
