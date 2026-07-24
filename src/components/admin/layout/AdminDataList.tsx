import { Paper, Stack, Typography } from "@mui/material";
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
  if (!items.length) return <Typography color="text.secondary">{empty}</Typography>;
  return <Stack gap={1.5}>{items.map((item, index) => <Paper variant="outlined" sx={{ p: 2 }} key={String(item.id ?? item.userId ?? index)}>{render(item)}</Paper>)}</Stack>;
}
