import { Button, Paper, Stack, Typography } from "@mui/material";
import AuthenticatedPage from "fitness/components/AuthenticatedPage";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import StatusChip from "fitness/components/common/StatusChip";
import { duplicateWorkout, getWorkoutById } from "fitness/utils/spec";
import type { Workout } from "fitness/utils/types";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function WorkoutDetailPage() {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : "";
  const [workout, setWorkout] = useState<Workout>();
  useEffect(() => { if (id) void getWorkoutById(id).then(setWorkout); }, [id]);
  return <AuthenticatedPage>{!workout ? <LoadingState /> : <>
    <PageHeader title={workout.name} action={{ label: "Edit", href: `/workouts/${workout.id}/edit` }} />
    <Paper sx={{ p: 3 }}>
      <Stack gap={2}><StatusChip status={workout.status} /><Typography>{new Date(workout.workoutDate).toLocaleDateString()}</Typography><Typography>{workout.durationMinutes ?? 0} minutes</Typography>
        {workout.exercises.map((item) => <Stack key={item.id}><Typography fontWeight={700}>{item.exercise.name}</Typography><Typography color="text.secondary">{item.sets.filter((set) => set.isCompleted).length} completed sets</Typography></Stack>)}
        <Button component={Link} href={`/workouts/${workout.id}/edit`}>Edit workout</Button>
        <Button onClick={async () => { const result = await duplicateWorkout(workout.id); await router.push(`/workouts/${result.id}/edit`); }}>Duplicate</Button>
      </Stack>
    </Paper>
  </>}</AuthenticatedPage>;
}
