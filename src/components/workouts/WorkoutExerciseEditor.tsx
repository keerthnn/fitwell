import { Autocomplete, Button, Stack, TextField } from "@mui/material";
import SetEditor from "fitness/components/workouts/SetEditor";
import { addExerciseToWorkout, getExercises } from "fitness/utils/spec";
import type { Exercise, Workout } from "fitness/utils/types";
import { useEffect, useState } from "react";

export default function WorkoutExerciseEditor({
  workout,
  onReload,
  disabled = false,
  onStartRest,
}: {
  workout: Workout;
  onReload: () => Promise<void>;
  disabled?: boolean;
  onStartRest?: (seconds: number) => void;
}) {
  const [catalogue, setCatalogue] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingCatalogue, setIsLoadingCatalogue] = useState(false);

  useEffect(() => {
    let isActive = true;
    const timeout = window.setTimeout(
      () => {
        setIsLoadingCatalogue(true);
        void getExercises({
          limit: "100",
          ...(searchTerm.trim() ? { search: searchTerm.trim() } : {}),
        })
          .then((result) => {
            if (isActive) setCatalogue(result.items);
          })
          .catch(() => {
            if (isActive) setCatalogue([]);
          })
          .finally(() => {
            if (isActive) setIsLoadingCatalogue(false);
          });
      },
      searchTerm ? 250 : 0,
    );

    return () => {
      isActive = false;
      window.clearTimeout(timeout);
    };
  }, [searchTerm]);

  return (
    <Stack gap={3}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ sm: "center" }}
        gap={1.5}
        sx={{
          p: { xs: 1.5, sm: 2 },
          borderRadius: 2.5,
          bgcolor: "action.hover",
        }}
      >
        <Autocomplete
          sx={{ flex: 1, minWidth: 0 }}
          options={catalogue}
          value={selectedExercise}
          disabled={disabled}
          loading={isLoadingCatalogue}
          autoHighlight
          openOnFocus
          filterOptions={(options) => options}
          getOptionLabel={(exercise) => exercise.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(_event, value) => setSelectedExercise(value)}
          onInputChange={(_event, value, reason) => {
            if (reason === "input" || reason === "clear") {
              setSearchTerm(value);
            }
          }}
          slotProps={{
            listbox: {
              sx: { maxHeight: { xs: "40vh", sm: 320 } },
            },
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Add exercise"
              placeholder="Search exercises"
            />
          )}
        />
        <Button
          sx={{ minWidth: 112 }}
          variant="outlined"
          disabled={disabled || !selectedExercise}
          onClick={async () => {
            if (!selectedExercise) return;
            await addExerciseToWorkout(workout.id, {
              exerciseId: selectedExercise.id,
              order: workout.exercises.length,
            });
            setSelectedExercise(null);
            setSearchTerm("");
            await onReload();
          }}
        >
          Add
        </Button>
      </Stack>
      {workout.exercises.map((item) => (
        <SetEditor
          key={item.id}
          item={item}
          disabled={disabled}
          onStartRest={onStartRest}
        />
      ))}
    </Stack>
  );
}
