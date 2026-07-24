import { Alert, MenuItem, TextField } from "@mui/material";
import AuthenticatedPage from "fitness/components/AuthenticatedPage";
import EmptyState from "fitness/components/common/EmptyState";
import ErrorState from "fitness/components/common/ErrorState";
import FilterToolbar from "fitness/components/common/FilterToolbar";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import SearchInput from "fitness/components/common/SearchInput";
import ExerciseList from "fitness/components/exercises/ExerciseList";
import { exerciseCategories } from "fitness/utils/exerciseCatalog";
import {
  addExerciseToWorkout,
  createWorkout,
  getExercises,
} from "fitness/utils/spec";
import type { Exercise } from "fitness/utils/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ExercisesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<Exercise[]>();
  const [error, setError] = useState("");
  const [startError, setStartError] = useState("");
  const [startingExerciseId, setStartingExerciseId] = useState("");
  const [equipment, setEquipment] = useState("");
  const [category, setCategory] = useState("");
  const [movement, setMovement] = useState("");
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setError("");
      const params = {
        ...(search ? { search } : {}),
        ...(equipment ? { equipment } : {}),
        ...(category ? { category } : {}),
        ...(movement ? { movement } : {}),
      };
      void getExercises(params)
        .then((result) => setItems(result.items))
        .catch(() => setError("The exercise catalogue could not be loaded."));
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [search, equipment, category, movement]);

  async function startWorkout(exercise: Exercise) {
    setStartError("");
    setStartingExerciseId(exercise.id);
    try {
      const workout = await createWorkout({
        name: `${exercise.name} workout`,
        workoutDate: new Date().toISOString(),
        entryMode: "LIVE",
      });
      await addExerciseToWorkout(workout.id, {
        exerciseId: exercise.id,
        order: 0,
      });
      await router.push(`/workouts/live/${workout.id}`);
    } catch {
      setStartError("The workout could not be started. Please try again.");
      setStartingExerciseId("");
    }
  }

  return (
    <AuthenticatedPage>
      <PageHeader
        title="Exercises"
        description="Browse the FitWell movement catalogue."
        action={{ label: "Start empty workout", href: "/workouts/create" }}
      />
      {startError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {startError}
        </Alert>
      )}
      <FilterToolbar>
        <SearchInput
          value={search}
          onChange={setSearch}
          label="Search exercises"
        />
        <TextField
          select
          label="Equipment"
          value={equipment}
          onChange={(event) => setEquipment(event.target.value)}
        >
          <MenuItem value="">All equipment</MenuItem>
          {[
            "BARBELL",
            "DUMBBELL",
            "KETTLEBELL",
            "MACHINE",
            "BODYWEIGHT",
            "CABLE",
          ].map((value) => (
            <MenuItem key={value} value={value}>
              {value.toLowerCase()}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Muscle group"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <MenuItem value="">All muscle groups</MenuItem>
          {exerciseCategories.map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Movement"
          value={movement}
          onChange={(event) => setMovement(event.target.value)}
        >
          <MenuItem value="">All movements</MenuItem>
          {[
            "PUSH",
            "PULL",
            "SQUAT",
            "HINGE",
            "LUNGE",
            "ROTATION",
            "CARRY",
            "ISOMETRIC",
          ].map((value) => (
            <MenuItem key={value} value={value}>
              {value.toLowerCase()}
            </MenuItem>
          ))}
        </TextField>
      </FilterToolbar>
      {error ? (
        <ErrorState message={error} />
      ) : items === undefined ? (
        <LoadingState />
      ) : items.length === 0 ? (
        <EmptyState
          title="No exercises found"
          description="Try a different search."
        />
      ) : (
        <ExerciseList
          exercises={items}
          onStart={(exercise) => void startWorkout(exercise)}
          startingExerciseId={startingExerciseId}
        />
      )}
    </AuthenticatedPage>
  );
}
