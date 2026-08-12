import { Chip } from "@mui/material";

export default function StatusChip({ status }: { status: string }) {
  const label = status.replaceAll("_", " ").toLowerCase();
  const color =
    status === "COMPLETED" || status === "RESPONDED"
      ? "success"
      : status === "IN_PROGRESS" || status === "OPEN"
        ? "warning"
        : status === "DRAFT" || status === "SCHEDULED"
          ? "warning"
          : status === "CANCELLED"
            ? "error"
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
