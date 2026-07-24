import { Alert, Button, Paper, Stack } from "@mui/material";
import AuthenticatedPage from "fitness/components/AuthenticatedPage";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import WorkoutExerciseEditor from "fitness/components/workouts/WorkoutExerciseEditor";
import { completeWorkout, getWorkoutById, pauseWorkout } from "fitness/utils/spec";
import type { Workout } from "fitness/utils/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function LiveWorkoutPage() {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : "";
  const [workout, setWorkout] = useState<Workout>();
  const reload = async () => { if (id) setWorkout(await getWorkoutById(id)); };
  useEffect(() => { if (id) void getWorkoutById(id).then(setWorkout); }, [id]);
  return <AuthenticatedPage>{!workout ? <LoadingState /> : <>
    <PageHeader title={workout.name} />
    <Alert severity="info" sx={{ mb: 2 }}>Changes to exercise sets are saved as you work.</Alert>
    <Paper sx={{ p: 3 }}><Stack gap={3}>
      <WorkoutExerciseEditor workout={workout} onReload={reload} />
      <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
        <Button variant="outlined" onClick={async () => { await pauseWorkout(workout.id); await router.push("/workouts"); }}>Pause</Button>
        <Button variant="contained" onClick={async () => { await completeWorkout(workout.id); await router.push(`/workouts/${workout.id}`); }}>Complete workout</Button>
      </Stack>
    </Stack></Paper>
  </>}</AuthenticatedPage>;
}
