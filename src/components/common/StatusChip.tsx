import { Chip } from "@mui/material";

export default function StatusChip({ status }: { status: string }) {
  const label = status.replaceAll("_", " ").toLowerCase();
  const color =
    status === "COMPLETED"
      ? "success"
      : status === "IN_PROGRESS"
        ? "primary"
        : "default";
  return (
    <Chip
      size="small"
      color={color}
      label={label}
      sx={{ textTransform: "capitalize" }}
    />
  );
}
