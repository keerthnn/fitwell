import { Button, Grid, Paper, Stack, Typography } from "@mui/material";
import AuthenticatedPage from "fitness/components/AuthenticatedPage";
import EmptyState from "fitness/components/common/EmptyState";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import StatCard from "fitness/components/common/StatCard";
import StatusChip from "fitness/components/common/StatusChip";
import { getDashboardSummary } from "fitness/utils/spec";
import type { DashboardSummary } from "fitness/utils/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary>();
  useEffect(() => { void getDashboardSummary().then(setSummary); }, []);
  return (
    <AuthenticatedPage>
      {!summary ? <LoadingState label="Loading dashboard" /> : (
        <>
          <PageHeader title={`Good to see you, ${summary.greetingName}`} description="Keep building the habit, one session at a time." action={{ label: "Start workout", href: "/workouts/create" }} />
          <Grid container spacing={2} mb={4}>
            <Grid size={{ xs: 6, md: 3 }}><StatCard label="This week" value={`${summary.workoutsThisWeek}/${summary.weeklyTarget}`} /></Grid>
            <Grid size={{ xs: 6, md: 3 }}><StatCard label="Current streak" value={`${summary.currentStreak} days`} /></Grid>
            <Grid size={{ xs: 6, md: 3 }}><StatCard label="Total time" value={`${summary.totalDurationMinutes} min`} /></Grid>
          </Grid>
          {summary.activeWorkout && (
            <Paper sx={{ p: 3, mb: 4 }}>
              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2}>
                <Stack><Typography variant="h6">{summary.activeWorkout.name}</Typography><Typography color="text.secondary">Your workout is in progress.</Typography></Stack>
                <Button component={Link} href={`/workouts/live/${summary.activeWorkout.id}`} variant="contained">Resume</Button>
              </Stack>
            </Paper>
          )}
          <Typography variant="h5" mb={2}>Recent workouts</Typography>
          {summary.recentWorkouts.length ? (
            <Stack gap={1.5}>
              {summary.recentWorkouts.map((workout) => workout && (
                <Paper key={workout.id} variant="outlined" sx={{ p: 2 }}>
                  <Stack direction="row" justifyContent="space-between"><Typography fontWeight={700}>{workout.name}</Typography><StatusChip status={workout.status} /></Stack>
                </Paper>
              ))}
            </Stack>
          ) : <EmptyState title="No workouts yet" description="Start your first workout or choose a built-in Workout Plan." />}
        </>
      )}
    </AuthenticatedPage>
  );
}
