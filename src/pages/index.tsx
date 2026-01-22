import Head from "next/head";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useAuth } from "fitness/components/context";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  return (
    <>
      <Head>
        <title>Fitwell</title>
        <meta name="description" content="Fitness tracking application" />
      </Head>

      <Container maxWidth="md">
        <Box
          minHeight="80vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Stack spacing={3} alignItems="center" textAlign="center">
            <Typography variant="h3" fontWeight="bold">
              Welcome to Fitwell
            </Typography>

            <Typography color="text.secondary">
              Track workouts, monitor progress, and stay consistent.
            </Typography>

            {!loading && !user && (
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  onClick={() => router.push("/auth/sign-in")}
                >
                  Sign In
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => router.push("/auth/sign-up")}
                >
                  Sign Up
                </Button>
              </Stack>
            )}

            {!loading && user && (
              <Button
                variant="contained"
                onClick={() => router.push("/dashboard")}
              >
                Go to Dashboard
              </Button>
            )}
          </Stack>
        </Box>
      </Container>
    </>
  );
}
