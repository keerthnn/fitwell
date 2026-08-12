import { Grid, Paper, Stack, Typography } from "@mui/material";
import AuthenticatedPage from "fitness/components/AuthenticatedPage";
import ErrorState from "fitness/components/common/ErrorState";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import StatCard from "fitness/components/common/StatCard";
import { getAnalytics } from "fitness/utils/spec";
import type { AnalyticsSummary } from "fitness/utils/types";
import { useEffect, useState } from "react";

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<AnalyticsSummary>();
  const [error, setError] = useState("");
  useEffect(() => {
    void getAnalytics()
      .then(setSummary)
      .catch(() => setError("Workout analytics could not be loaded."));
  }, []);
  return (
    <AuthenticatedPage>
      <PageHeader
        title="Analytics"
        description="Workout-focused progress for the last 30 days."
      />
      {error ? (
        <ErrorState message={error} />
      ) : !summary ? (
        <LoadingState />
      ) : (
        <>
          <Grid container spacing={2} mb={3}>
            <Grid size={{ xs: 6, md: 3 }}>
              <StatCard label="Completed" value={summary.completedWorkouts} />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <StatCard
                label="Duration"
                value={`${summary.durationMinutes} min`}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <StatCard
                label="Volume"
                value={`${Math.round(summary.totalVolumeKg)} kg`}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <StatCard label="Exercises" value={summary.exercisesPerformed} />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <MetricList
                title="Workout frequency"
                items={summary.workoutFrequency}
                valueLabel={(value) => `${value} workout${value === 1 ? "" : "s"}`}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <MetricList
                title="Muscle distribution"
                items={summary.muscleDistribution}
                valueLabel={(value) => `${value} exercise${value === 1 ? "" : "s"}`}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <MetricList
                title="Personal bests"
                items={summary.personalBests.map((item) => ({
                  name: item.exercise,
                  value: item.weightKg,
                }))}
                valueLabel={(value) => `${value} kg`}
                empty="Complete weighted sets to see personal bests."
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <MetricList
                title="Workout Plan usage"
                items={summary.workoutPlanUsage}
                valueLabel={(value) => `${value} workout${value === 1 ? "" : "s"}`}
              />
            </Grid>
          </Grid>
        </>
      )}
    </AuthenticatedPage>
  );
}

function MetricList({
  title,
  items,
  valueLabel = (value) => String(value),
  empty = "Complete a workout to see this insight.",
}: {
  title: string;
  items: Array<{ name: string; value: number }>;
  valueLabel?: (value: number) => string;
  empty?: string;
}) {
  return (
    <Paper variant="outlined" sx={{ p: 3, height: "100%", minHeight: 180 }}>
      <Typography variant="h6" mb={2}>
        {title}
      </Typography>
      <Stack gap={1}>
        {items.length ? (
          items.map((item) => (
            <Stack
              key={item.name}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              gap={2}
              sx={{ py: 0.5 }}
            >
              <Typography color="text.secondary">{item.name}</Typography>
              <Typography fontWeight={800}>{valueLabel(item.value)}</Typography>
            </Stack>
          ))
        ) : (
          <Typography color="text.secondary">{empty}</Typography>
        )}
      </Stack>
    </Paper>
  );
}
