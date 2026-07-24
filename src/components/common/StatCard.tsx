import { Paper, Typography } from "@mui/material";

export default function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5, minWidth: 0 }}>
      <Typography color="text.secondary" variant="body2">{label}</Typography>
      <Typography variant="h4" fontWeight={800}>{value}</Typography>
    </Paper>
  );
}
