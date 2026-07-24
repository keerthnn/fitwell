import { Button, Paper, Stack, Typography } from "@mui/material";
import AuthenticatedPage from "fitness/components/AuthenticatedPage";
import EmptyState from "fitness/components/common/EmptyState";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import StatusChip from "fitness/components/common/StatusChip";
import { getWorkouts } from "fitness/utils/spec";
import type { WorkoutListItem } from "fitness/utils/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<WorkoutListItem[]>();
  useEffect(() => { void getWorkouts().then((result) => setWorkouts(result.items)); }, []);
  return (
    <AuthenticatedPage>
      <PageHeader title="Workouts" description="Your workout history and sessions." action={{ label: "Start workout", href: "/workouts/create" }} />
      <Button component={Link} href="/workouts/quick-entry" sx={{ mb: 3 }}>Add quick entry</Button>
      {!workouts ? <LoadingState /> : workouts.length === 0 ? <EmptyState title="No workouts" description="Start a live workout or add a quick entry." /> : (
        <Stack gap={1.5}>{workouts.map((workout) => (
          <Paper key={workout.id} variant="outlined" sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack><Typography component={Link} href={`/workouts/${workout.id}`} fontWeight={700} color="inherit">{workout.name}</Typography><Typography color="text.secondary" variant="body2">{new Date(workout.workoutDate).toLocaleDateString()} · {workout.exerciseCount} exercises</Typography></Stack>
              <StatusChip status={workout.status} />
            </Stack>
          </Paper>
        ))}</Stack>
      )}
    </AuthenticatedPage>
  );
}
