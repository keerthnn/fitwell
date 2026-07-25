import {
  AccessTime,
  CalendarMonth,
  CheckCircleOutline,
  LocalFireDepartment,
  PlayArrow,
} from "@mui/icons-material";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import ThemeModeSelector from "fitness/components/ThemeModeSelector";
import type { DashboardSummary } from "fitness/utils/types";
import Link from "next/link";
import ActiveWorkoutBanner from "./ActiveWorkoutBanner";
import { FrequentExercisesPanel, RecentWorkoutsPanel } from "./DashboardPanels";
import DashboardStatCard from "./DashboardStatCard";

export default function DashboardContent({
  summary,
}: {
  summary: DashboardSummary;
}) {
  return (
    <>
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
            sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}
          >
            Good to see you, {summary.greetingName} 👋
          </Typography>
          <Typography color="text.secondary" mt={0.5}>
            Keep building the habit, one focused session at a time.
          </Typography>
        </Box>
        <Stack direction="row" gap={1} alignItems="center">
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <ThemeModeSelector />
          </Box>
          <Button
            component={Link}
            href="/workouts/create"
            variant="contained"
            size="large"
            startIcon={<PlayArrow />}
            sx={{ flex: { xs: 1, sm: "initial" }, minWidth: { sm: 194 } }}
          >
            Start workout
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={1.5} mb={3}>
        <Grid size={{ xs: 6, lg: 3 }}>
          <DashboardStatCard
            icon={<CalendarMonth />}
            label="Weekly progress"
            value={`${summary.workoutsThisWeek}/${summary.weeklyTarget}`}
            helper="Workouts"
            tone="primary"
            progress={
              summary.weeklyTarget
                ? (summary.workoutsThisWeek / summary.weeklyTarget) * 100
                : 0
            }
          />
        </Grid>
        <Grid size={{ xs: 6, lg: 3 }}>
          <DashboardStatCard
            icon={<LocalFireDepartment />}
            label="Current streak"
            value={summary.currentStreak}
            helper={summary.currentStreak === 1 ? "day" : "days"}
            tone="warning"
          />
        </Grid>
        <Grid size={{ xs: 6, lg: 3 }}>
          <DashboardStatCard
            icon={<CheckCircleOutline />}
            label="Completed workouts"
            value={summary.completedWorkouts}
            helper="All time"
            tone="success"
          />
        </Grid>
        <Grid size={{ xs: 6, lg: 3 }}>
          <DashboardStatCard
            icon={<AccessTime />}
            label="Training time"
            value={summary.totalDurationMinutes}
            helper="minutes"
            tone="info"
          />
        </Grid>
      </Grid>

      {summary.activeWorkout && (
        <ActiveWorkoutBanner workout={summary.activeWorkout} />
      )}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <RecentWorkoutsPanel workouts={summary.recentWorkouts} />
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <FrequentExercisesPanel exercises={summary.frequentExercises} />
        </Grid>
      </Grid>
    </>
  );
}
