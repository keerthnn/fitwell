import { Chip } from "@mui/material";

export default function StatusChip({ status }: { status: string }) {
  const label = status.replaceAll("_", " ").toLowerCase();
  return <Chip size="small" label={label} sx={{ textTransform: "capitalize" }} />;
}
