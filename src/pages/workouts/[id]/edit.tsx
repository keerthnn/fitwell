import { Button, Paper, Stack, TextField } from "@mui/material";
import AuthenticatedPage from "fitness/components/AuthenticatedPage";
import ErrorState from "fitness/components/common/ErrorState";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import WorkoutExerciseEditor from "fitness/components/workouts/WorkoutExerciseEditor";
import {
  completeWorkout,
  getWorkoutById,
  updateWorkout,
} from "fitness/utils/spec";
import type { Workout } from "fitness/utils/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditWorkoutPage() {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : "";
  const [workout, setWorkout] = useState<Workout>();
  const [error, setError] = useState("");
  const reload = async () => {
    if (id) setWorkout(await getWorkoutById(id));
  };
  useEffect(() => {
    if (id)
      void getWorkoutById(id)
        .then(setWorkout)
        .catch(() => setError("This workout could not be loaded."));
  }, [id]);
  return (
    <AuthenticatedPage>
      {error ? (
        <ErrorState message={error} />
      ) : !workout ? (
        <LoadingState />
      ) : (
        <>
          <PageHeader title="Edit workout" />
          <Paper sx={{ p: { xs: 2, sm: 4 }, maxWidth: 720 }}>
            <Stack
              component="form"
              gap={2}
              onSubmit={async (event) => {
                event.preventDefault();
                await updateWorkout({
                  id: workout.id,
                  name: workout.name,
                  workoutDate: workout.workoutDate,
                  entryMode: workout.entryMode,
                  durationMinutes: workout.durationMinutes ?? undefined,
                  notes: workout.notes ?? undefined,
                });
                await router.push(`/workouts/${workout.id}`);
              }}
            >
              <TextField
                label="Name"
                value={workout.name}
                onChange={(event) =>
                  setWorkout({ ...workout, name: event.target.value })
                }
              />
              <TextField
                multiline
                minRows={3}
                label="Notes"
                value={workout.notes ?? ""}
                onChange={(event) =>
                  setWorkout({ ...workout, notes: event.target.value })
                }
              />
              <Button type="submit" variant="contained">
                Save workout
              </Button>
            </Stack>
          </Paper>
          <Paper sx={{ p: { xs: 2, sm: 4 }, maxWidth: 900, mt: 3 }}>
            <Stack gap={3}>
              <WorkoutExerciseEditor workout={workout} onReload={reload} />
              {workout.status !== "COMPLETED" && (
                <Button
                  onClick={async () => {
                    await completeWorkout(workout.id);
                    await router.push(`/workouts/${workout.id}`);
                  }}
                >
                  Mark workout complete
                </Button>
              )}
            </Stack>
          </Paper>
        </>
      )}
    </AuthenticatedPage>
  );
}
