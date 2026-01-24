import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import {
  cardDefault,
  cardPrimary,
  cardSecondary,
} from "fitness/utils/dashboardCSS";
import { getWorkouts } from "fitness/utils/spec";
import { WorkoutListItem } from "fitness/utils/types";
import { useEffect, useMemo, useState } from "react";

function startOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

function isSameMonth(a: Date, b: Date) {
  return a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
}

export default function Dashboard() {
  const [workouts, setWorkouts] = useState<WorkoutListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWorkouts()
      .then(setWorkouts)
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now);

    const total = workouts.length;

    const thisWeek = workouts.filter((w) => {
      const d = new Date(w.date);
      return d >= weekStart;
    }).length;

    const thisMonth = workouts.filter((w) =>
      isSameMonth(new Date(w.date), now),
    ).length;

    const recent = workouts.slice(0, 5);

    return { total, thisWeek, thisMonth, recent };
  }, [workouts]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography>Loading dashboard…</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Dashboard
            </Typography>
            <Typography color="text.secondary">
              Track your progress and stay consistent with your goals
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            <Paper sx={cardPrimary}>
              <Typography variant="h3" fontWeight={700}>
                {stats.thisWeek}
              </Typography>
              <Typography sx={{ mt: 1, opacity: 0.9 }}>
                Workouts This Week
              </Typography>
            </Paper>

            <Paper sx={cardSecondary}>
              <Typography variant="h3" fontWeight={700}>
                0
              </Typography>
              <Typography sx={{ mt: 1, opacity: 0.9 }}>
                Current Streak
              </Typography>
            </Paper>

            <Paper sx={cardDefault}>
              <Typography variant="h3" fontWeight={700}>
                {stats.total}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Total Workouts
              </Typography>
            </Paper>
          </Box>

          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            <Paper
              sx={{ flex: "2 1 520px", p: 4, minHeight: 320, borderRadius: 3 }}
            >
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Recent Activity
              </Typography>

              {stats.recent.length === 0 ? (
                <Typography color="text.secondary">No workouts yet</Typography>
              ) : (
                <Stack spacing={2}>
                  {stats.recent.map((w) => (
                    <Box key={w.id}>
                      <Typography fontWeight={600}>
                        {w.title || "Untitled Workout"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(w.date).toLocaleDateString()} ·{" "}
                        {w.exerciseCount} exercises
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </Paper>

            <Paper
              sx={{ flex: "1 1 280px", p: 4, minHeight: 320, borderRadius: 3 }}
            >
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Quick Stats
              </Typography>

              <Stack spacing={2.5} sx={{ mt: 3 }}>
                <Box>
                  <Typography color="text.secondary">This Month</Typography>
                  <Typography fontWeight={600}>
                    {stats.thisMonth} workouts
                  </Typography>
                </Box>

                <Box>
                  <Typography color="text.secondary">Best Streak</Typography>
                  <Typography fontWeight={600}>0 days</Typography>
                </Box>

                <Box>
                  <Typography color="text.secondary">Average Weekly</Typography>
                  <Typography fontWeight={600}>
                    {Math.round(stats.total / Math.max(1, 4))} sessions
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
