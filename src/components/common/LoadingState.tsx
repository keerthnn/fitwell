import { CircularProgress, Stack, Typography } from "@mui/material";

export default function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <Stack minHeight={240} alignItems="center" justifyContent="center" gap={2}>
      <CircularProgress aria-label={label} />
      <Typography color="text.secondary">{label}…</Typography>
    </Stack>
  );
}
