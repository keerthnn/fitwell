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
        <Typography
          variant="h4"
          component="h1"
          fontWeight={800}
          sx={{ fontSize: { xs: "1.75rem", sm: "2rem" } }}
        >
          {title}
        </Typography>
        {description && (
          <Typography color="text.secondary" mt={0.5}>
            {description}
          </Typography>
        )}
      </Box>
      {action && (
        <Button
          component={Link}
          href={action.href}
          variant="contained"
          size="large"
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          {action.label}
        </Button>
      )}
    </Stack>
  );
}
