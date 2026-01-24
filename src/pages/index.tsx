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
        <title>Fitwell - Track Your Fitness Journey</title>
        <meta name="description" content="Track workouts, monitor progress, and stay consistent with Fitwell" />
      </Head>

      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container maxWidth="md">
          <Stack spacing={5} alignItems="center" textAlign="center">
            <Stack spacing={2}>
              <Typography 
                variant="h3" 
                fontWeight="bold"
                sx={{ 
                  color: "text.primary",
                  mb: 1,
                }}
              >
                Your Fitness Journey Starts Here
              </Typography>

              <Typography 
                variant="h6" 
                color="text.secondary"
                sx={{ maxWidth: 600, mx: "auto" }}
              >
                Track workouts, monitor progress, and build lasting habits with personalized insights
              </Typography>
            </Stack>

            <Stack 
              direction={{ xs: "column", sm: "row" }} 
              spacing={2}
              sx={{ pt: 2 }}
            >
              {!loading && !user && (
                <>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => router.push("/auth/sign-up")}
                    sx={{ minWidth: 160 }}
                  >
                    Get Started
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => router.push("/auth/sign-in")}
                    sx={{ minWidth: 160 }}
                  >
                    Sign In
                  </Button>
                </>
              )}

              {!loading && user && (
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => router.push("/dashboard")}
                  sx={{ minWidth: 200 }}
                >
                  Go to Dashboard
                </Button>
              )}
            </Stack>

            <Stack 
              direction="row" 
              spacing={4} 
              sx={{ 
                pt: 4,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <Box textAlign="center">
                <Typography variant="h6" color="primary" fontWeight="bold">
                  Track
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Log every workout
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h6" color="primary" fontWeight="bold">
                  Progress
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Monitor your gains
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h6" color="primary" fontWeight="bold">
                  Achieve
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Reach your goals
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
}