import { Box, Button, Stack, Typography } from "@mui/material";
import Link from "next/link";

export default function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: { label: string; href: string };
}) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "stretch", sm: "center" }}
      gap={2}
      mb={3}
    >
      <Box>
        <Typography variant="h4" component="h1" fontWeight={800}>
          {title}
        </Typography>
        {description && <Typography color="text.secondary">{description}</Typography>}
      </Box>
      {action && (
        <Button component={Link} href={action.href} variant="contained" size="large">
          {action.label}
        </Button>
      )}
    </Stack>
  );
}
