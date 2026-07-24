import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import AuthenticatedPage from "fitness/components/AuthenticatedPage";
import EmptyState from "fitness/components/common/EmptyState";
import ErrorState from "fitness/components/common/ErrorState";
import FitWellImage from "fitness/components/common/FitWellImage";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import SectionHeader from "fitness/components/common/SectionHeader";
import StatCard from "fitness/components/common/StatCard";
import WorkoutCard from "fitness/components/workouts/WorkoutCard";
import {
  isApprovedLocalImagePath,
  resolveExerciseImageCandidates,
} from "fitness/lib/images/assetRegistry";
import { getDashboardSummary } from "fitness/utils/spec";
import type { DashboardSummary } from "fitness/utils/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary>();
  const [error, setError] = useState("");
  useEffect(() => {
    void getDashboardSummary()
      .then(setSummary)
      .catch(() => setError("Your dashboard could not be loaded."));
  }, []);
  return (
    <AuthenticatedPage>
      {error ? (
        <ErrorState message={error} onRetry={() => location.reload()} />
      ) : !summary ? (
        <LoadingState label="Loading dashboard" />
      ) : (
        <>
          <PageHeader
            title={`Good to see you, ${summary.greetingName}`}
            description="Keep building the habit, one focused session at a time."
            action={{ label: "Start workout", href: "/workouts/create" }}
          />
          <Grid container spacing={2} mb={5}>
            <Grid size={{ xs: 6, lg: 3 }}>
              <StatCard
                label="Weekly progress"
                value={`${summary.workoutsThisWeek}/${summary.weeklyTarget}`}
              />
            </Grid>
            <Grid size={{ xs: 6, lg: 3 }}>
              <StatCard
                label="Current streak"
                value={`${summary.currentStreak} days`}
              />
            </Grid>
            <Grid size={{ xs: 6, lg: 3 }}>
              <StatCard label="Completed" value={summary.completedWorkouts} />
            </Grid>
            <Grid size={{ xs: 6, lg: 3 }}>
              <StatCard
                label="Training time"
                value={`${summary.totalDurationMinutes} min`}
              />
            </Grid>
          </Grid>
          {summary.activeWorkout && (
            <Card
              sx={{
                p: { xs: 2, sm: 3 },
                mb: 5,
                border: "1px solid",
                borderColor: "primary.main",
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.palette.primary.main}18, ${theme.palette.background.paper})`,
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ sm: "center" }}
                gap={2}
              >
                <Stack>
                  <Typography
                    variant="overline"
                    color="primary"
                    fontWeight={800}
                  >
                    WORKOUT IN PROGRESS
                  </Typography>
                  <Typography variant="h5">
                    {summary.activeWorkout.name}
                  </Typography>
                </Stack>
                <Button
                  component={Link}
                  href={`/workouts/live/${summary.activeWorkout.id}`}
                  variant="contained"
                  size="large"
                >
                  Continue workout
                </Button>
              </Stack>
            </Card>
          )}
          <SectionHeader>Recent workouts</SectionHeader>
          {summary.recentWorkouts.length ? (
            <Grid container spacing={2} mb={5}>
              {summary.recentWorkouts.map((workout) => (
                <Grid key={workout.id} size={{ xs: 12, lg: 6 }}>
                  <WorkoutCard workout={workout} compact />
                </Grid>
              ))}
            </Grid>
          ) : (
            <EmptyState
              title="No workouts yet"
              description="Start your first workout or choose a built-in Workout Plan."
            />
          )}
          {summary.frequentExercises.length > 0 && (
            <>
              <SectionHeader>Frequently used exercises</SectionHeader>
              <Grid container spacing={2}>
                {summary.frequentExercises.map(({ exercise, count }) => (
                  <Grid key={exercise.name} size={{ xs: 6, md: 3 }}>
                    <Card
                      variant="outlined"
                      sx={{ overflow: "hidden", height: "100%" }}
                    >
                      <FitWellImage
                        candidates={resolveExerciseImageCandidates(exercise)}
                        alt={`${exercise.name} exercise illustration`}
                        aspectRatio="1 / 1"
                      />
                      <CardContent>
                        <Typography fontWeight={700}>
                          {exercise.name}
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                          Used in {count} workouts
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
          {summary.savedPlans.length > 0 && (
            <Box mt={5}>
              <SectionHeader>Saved Workout Plans</SectionHeader>
              <Grid container spacing={2}>
                {summary.savedPlans.map((plan) => (
                  <Grid key={plan.id} size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card
                      variant="outlined"
                      sx={{ overflow: "hidden", height: "100%" }}
                    >
                      <FitWellImage
                        candidates={[
                          ...(isApprovedLocalImagePath(plan.coverImagePath)
                            ? [
                                {
                                  src: plan.coverImagePath!,
                                  kind: "specific" as const,
                                },
                              ]
                            : []),
                          {
                            src: "/images/workouts/strength-768.webp",
                            srcSet:
                              "/images/workouts/strength-384.webp 384w, /images/workouts/strength-768.webp 768w",
                            kind: "fallback",
                          },
                        ]}
                        alt={`${plan.name} Workout Plan cover`}
                        aspectRatio="3 / 2"
                        objectFit="contain"
                      />
                      <CardContent>
                        <Typography fontWeight={700}>{plan.name}</Typography>
                        <Button
                          component={Link}
                          href={`/workout-plans/${plan.id}`}
                          sx={{ mt: 1 }}
                        >
                          View plan
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </>
      )}
    </AuthenticatedPage>
  );
}
