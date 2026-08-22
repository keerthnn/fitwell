import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { ArrowBack } from "fitness/components/common/icons";
import Link from "next/link";

export default function PageHeader({
  title,
  description,
  action,
  backLink,
}: {
  title: string;
  description?: string;
  action?: { label: string; href: string };
  backLink?: { label: string; href: string };
}) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "stretch", sm: "center" }}
      gap={2}
      mb={3}
    >
      <Stack direction="row" alignItems="flex-start" gap={1}>
        {backLink && (
          <IconButton
            component={Link}
            href={backLink.href}
            aria-label={backLink.label}
            title={backLink.label}
            sx={{ mt: 0.125, ml: -1 }}
          >
            <ArrowBack />
          </IconButton>
        )}
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
      </Stack>
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
