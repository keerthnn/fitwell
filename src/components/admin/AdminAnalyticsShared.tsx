import {
  Alert,
  Box,
  Button,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import type {
  DistributionPoint,
  RankedAnalyticsItem,
} from "fitness/utils/types";

export function AnalyticsLoading() {
  return (
    <Stack spacing={2}>
      <Skeleton height={120} />
      <Skeleton height={360} />
    </Stack>
  );
}

export function AnalyticsError({
  message,
  retry,
}: {
  message: string;
  retry: () => void;
}) {
  return (
    <Alert
      severity="error"
      action={
        <Button color="inherit" onClick={retry}>
          Retry
        </Button>
      }
    >
      {message}
    </Alert>
  );
}

export function StatGrid({
  items,
}: {
  items: Array<{ label: string; value: string | number; helper?: string }>;
}) {
  return (
    <Box
      sx={{
        display: "grid",
        width: "100%",
        maxWidth: "100%",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0,1fr))",
          md: "repeat(4, minmax(0,1fr))",
        },
        gap: 2,
      }}
    >
      {items.map((item) => (
        <Paper key={item.label} sx={{ p: 2.5 }}>
          <Typography variant="h5" fontWeight={700}>
            {item.value}
          </Typography>
          <Typography color="text.secondary">{item.label}</Typography>
          {item.helper && (
            <Typography variant="caption" color="text.secondary">
              {item.helper}
            </Typography>
          )}
        </Paper>
      ))}
    </Box>
  );
}

export function RankedList({
  title,
  items,
}: {
  title: string;
  items: RankedAnalyticsItem[] | DistributionPoint[];
}) {
  return (
    <Paper sx={{ p: 3, minWidth: 0, maxWidth: "100%" }}>
      <Typography variant="h6" mb={2}>
        {title}
      </Typography>
      {items.length ? (
        <Stack spacing={1.5}>
          {items.map((item, index) => (
            <Box
              key={`${item.name}-${index}`}
              display="flex"
              justifyContent="space-between"
              gap={2}
              minWidth={0}
            >
              <Typography sx={{ minWidth: 0, overflowWrap: "anywhere" }}>
                {item.name}
              </Typography>
              <Typography fontWeight={700} sx={{ flexShrink: 0 }}>
                {item.value}
              </Typography>
            </Box>
          ))}
        </Stack>
      ) : (
        <Typography color="text.secondary">No data for this period.</Typography>
      )}
    </Paper>
  );
}
