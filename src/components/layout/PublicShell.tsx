import { Box, Button, Container, Stack, Typography } from "@mui/material";
import ThemeModeSelector from "fitness/components/ThemeModeSelector";
import Link from "next/link";
import type { ReactNode } from "react";

export default function PublicShell({ children }: { children: ReactNode }) {
  return (
    <Box minHeight="100vh" bgcolor="background.default">
      <Box
        component="header"
        sx={{
          position: "absolute",
          inset: "0 0 auto",
          zIndex: 2,
          py: 2,
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              component={Link}
              href="/"
              variant="h5"
              color="text.primary"
              sx={{ textDecoration: "none", fontWeight: 900 }}
            >
              Fit<span style={{ color: "#35c46a" }}>Well</span>
            </Typography>
            <Stack direction="row" gap={1} alignItems="center">
              <ThemeModeSelector />
              <Button component={Link} href="/auth/sign-in">
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
      {children}
    </Box>
  );
}
