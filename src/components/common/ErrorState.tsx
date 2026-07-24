import { Alert, Button, Stack } from "@mui/material";

export default function ErrorState({
  message = "Something went wrong.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <Stack gap={2}>
      <Alert severity="error">{message}</Alert>
      {onRetry && <Button onClick={onRetry}>Try again</Button>}
    </Stack>
  );
}
