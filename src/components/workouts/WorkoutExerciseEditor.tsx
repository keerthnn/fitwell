import { Alert, Autocomplete, Button, Stack, TextField } from "@mui/material";
import ExerciseDiscovery from "fitness/components/exercise-discovery/ExerciseDiscovery";
import SetEditor from "fitness/components/workouts/SetEditor";
import { addExerciseToWorkout, getExercises } from "fitness/utils/spec";
import type { Exercise, Workout } from "fitness/utils/types";
import { useEffect, useRef, useState } from "react";

export default function WorkoutExerciseEditor({
  workout,
  onReload,
  disabled = false,
  onStartRest,
  enableMuscleDiscovery = false,
}: {
  workout: Workout;
  onReload: () => Promise<void>;
  disabled?: boolean;
  onStartRest?: (seconds: number) => void;
  enableMuscleDiscovery?: boolean;
}) {
  const [catalogue, setCatalogue] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingCatalogue, setIsLoadingCatalogue] = useState(false);
  const [addError, setAddError] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [needsRefresh, setNeedsRefresh] = useState(false);
  const adding = useRef(false);
  const useDiscovery = enableMuscleDiscovery && workout.entryMode === "QUICK_ENTRY" && workout.status !== "COMPLETED";

  async function refreshAddedExercise() {
    try {
      await onReload();
      setNeedsRefresh(false);
      setAddError("");
    } catch {
      setNeedsRefresh(true);
      setAddError("The exercise was added, but the workout could not be refreshed. Retry refresh before adding more.");
    }
  }

  useEffect(() => {
    if (useDiscovery) return;
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
  }, [searchTerm, useDiscovery]);

  return (
    <Stack gap={3}>
      {useDiscovery ? (
        <Stack gap={1.5}>
          {addError && <Alert severity="error">{addError}</Alert>}
          {needsRefresh && <Button onClick={() => void refreshAddedExercise()}>Retry refresh</Button>}
          <ExerciseDiscovery
            disabled={disabled || isAdding || needsRefresh}
            selectedExerciseIds={workout.exercises.map((item) => item.exerciseId)}
            onAdd={async (exercise) => {
              if (disabled || adding.current || needsRefresh || workout.exercises.some((item) => item.exerciseId === exercise.id)) return;
              adding.current = true;
              setIsAdding(true);
              setAddError("");
              try {
                await addExerciseToWorkout(workout.id, {
                  exerciseId: exercise.id,
                  order: workout.exercises.length,
                });
                await refreshAddedExercise();
              } catch {
                setAddError("The exercise could not be added. Please try again.");
              } finally {
                adding.current = false;
                setIsAdding(false);
              }
            }}
          />
        </Stack>
      ) : (
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
      )}
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
