import { Button, MenuItem, Stack, TextField } from "@mui/material";
import SetEditor from "fitness/components/workouts/SetEditor";
import { addExerciseToWorkout, getExercises } from "fitness/utils/spec";
import type { Exercise, Workout } from "fitness/utils/types";
import { useEffect, useState } from "react";

export default function WorkoutExerciseEditor({
  workout,
  onReload,
}: {
  workout: Workout;
  onReload: () => Promise<void>;
}) {
  const [catalogue, setCatalogue] = useState<Exercise[]>([]);
  const [exerciseId, setExerciseId] = useState("");
  useEffect(() => { void getExercises({ limit: "100" }).then((result) => setCatalogue(result.items)); }, []);
  return (
    <Stack gap={2}>
      <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
        <TextField select label="Add exercise" value={exerciseId} onChange={(event) => setExerciseId(event.target.value)}>
          {catalogue.map((exercise) => <MenuItem key={exercise.id} value={exercise.id}>{exercise.name}</MenuItem>)}
        </TextField>
        <Button variant="outlined" disabled={!exerciseId} onClick={async () => {
          await addExerciseToWorkout(workout.id, { exerciseId, order: workout.exercises.length });
          setExerciseId("");
          await onReload();
        }}>Add</Button>
      </Stack>
      {workout.exercises.map((item) => <SetEditor key={item.id} item={item} />)}
    </Stack>
  );
}
