import { Box, Divider, Paper, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

export default function AdminDataList({
  items,
  empty,
  render,
}: {
  items: Array<Record<string, unknown>>;
  empty: string;
  render: (item: Record<string, unknown>) => ReactNode;
}) {
  if (!items.length) {
    return (
      <Paper variant="outlined" sx={{ p: 4, textAlign: "center" }}>
        <Typography color="text.secondary">{empty}</Typography>
      </Paper>
    );
  }

  return (
    <Paper
      variant="outlined"
      sx={{ px: { xs: 1.5, sm: 2.5 }, overflow: "hidden" }}
    >
      <Stack divider={<Divider flexItem />}>
        {items.map((item, index) => (
          <Box
            key={String(item.id ?? item.userId ?? index)}
            sx={{
              py: 1.75,
              minWidth: 0,
              "& a": { color: "inherit", textDecoration: "none" },
            }}
          >
            {render(item)}
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
