import { ArrowForward, BarChart, Bolt, CheckCircle } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import FitWellImage from "fitness/components/common/FitWellImage";
import { useAuth } from "fitness/components/context";
import Head from "next/head";
import Link from "next/link";

const features = [
  {
    icon: Bolt,
    title: "Focused workout logging",
    description:
      "Start live sessions or add a quick entry without unnecessary steps.",
  },
  {
    icon: BarChart,
    title: "Progress that stays useful",
    description:
      "See consistency, training time, exercise frequency, and workout trends.",
  },
  {
    icon: CheckCircle,
    title: "Plans ready to train",
    description:
      "Use built-in programmes or shape a private plan around your routine.",
  },
];

export default function Home() {
  const { user, loading } = useAuth();
  const destination = !loading && user ? "/dashboard" : "/auth/sign-up";
  return (
    <>
      <Head>
        <title>FitWell — Build a stronger training habit</title>
        <meta
          name="description"
          content="Track workouts, follow training plans, and understand your progress with FitWell."
        />
      </Head>
      <Box
        sx={{
          minHeight: "100vh",
          pt: { xs: 14, md: 18 },
          pb: 8,
          bgcolor: "background.default",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 6, md: 8 }} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack
                spacing={3}
                alignItems={{ xs: "center", md: "flex-start" }}
              >
                <Typography
                  variant="overline"
                  color="primary"
                  fontWeight={800}
                  letterSpacing={2}
                >
                  TRAIN WITH INTENTION
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    fontSize: { xs: "2.5rem", md: "4.25rem" },
                    textAlign: { xs: "center", md: "left" },
                  }}
                >
                  Your workouts, clearly tracked.
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  maxWidth={560}
                  textAlign={{ xs: "center", md: "left" }}
                >
                  A focused training dashboard for logging sessions, following
                  plans, and seeing the progress that keeps you moving.
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
                  <Button
                    component={Link}
                    href={destination}
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                  >
                    {!loading && user ? "Open dashboard" : "Start training"}
                  </Button>
                  {!user && (
                    <Button
                      component={Link}
                      href="/auth/sign-in"
                      variant="outlined"
                      size="large"
                    >
                      Sign in
                    </Button>
                  )}
                </Stack>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                sx={{
                  maxWidth: 520,
                  mx: "auto",
                  p: { xs: 2, sm: 4 },
                  bgcolor: "background.paper",
                }}
              >
                <FitWellImage
                  candidates={[
                    {
                      src: "/images/muscle-groups/front/full-body.png",
                      kind: "generated",
                    },
                    {
                      src: "/images/fallbacks/full-body.png",
                      kind: "fallback",
                    },
                  ]}
                  alt=""
                  aspectRatio="1 / 1"
                />
              </Card>
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={{ xs: 6, md: 10 }}>
            {features.map(({ icon: Icon, title, description }) => (
              <Grid key={title} size={{ xs: 12, md: 4 }}>
                <Card variant="outlined" sx={{ p: 3, height: "100%" }}>
                  <Icon color="primary" sx={{ fontSize: 34 }} />
                  <Typography variant="h6" mt={2}>
                    {title}
                  </Typography>
                  <Typography color="text.secondary" mt={1}>
                    {description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
}
