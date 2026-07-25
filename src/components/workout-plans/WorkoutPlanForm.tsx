import {
  Alert,
  Box,
  Button,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import WorkoutPlanExercisePrescription, {
  defaultPrescription,
  type ExercisePrescription,
} from "fitness/components/workout-plans/WorkoutPlanExercisePrescription";
import WorkoutExercisePicker from "fitness/components/workouts/WorkoutExercisePicker";
import {
  adminCreateWorkoutPlan,
  adminUpdateWorkoutPlan,
  createWorkoutPlan,
  updateWorkoutPlan,
} from "fitness/utils/spec";
import type { Exercise, WorkoutPlan } from "fitness/utils/types";
import { useRouter } from "next/router";
import { useState } from "react";

const initialSelectedExercises = (initial?: WorkoutPlan) =>
  initial?.exercises.flatMap((item) =>
    item.exercise ? [item.exercise] : [],
  ) ?? [];

const initialPrescriptions = (initial?: WorkoutPlan) =>
  Object.fromEntries(
    initial?.exercises.map((item) => [
      item.exerciseId,
      {
        sets: item.sets,
        minimumReps: item.minimumReps ?? 8,
        maximumReps: item.maximumReps ?? 12,
        restSeconds: item.restSeconds ?? 90,
      },
    ]) ?? [],
  ) as Record<string, ExercisePrescription>;

export default function WorkoutPlanForm({
  initial,
  admin = false,
  initialExercises,
}: {
  initial?: WorkoutPlan;
  admin?: boolean;
  initialExercises?: Exercise[];
}) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [difficulty, setDifficulty] = useState(
    initial?.difficulty ?? "BEGINNER",
  );
  const [category, setCategory] = useState(initial?.category ?? "General");
  const [daysPerWeek, setDaysPerWeek] = useState(initial?.daysPerWeek ?? 3);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>(() =>
    initialSelectedExercises(initial),
  );
  const [prescriptions, setPrescriptions] = useState<
    Record<string, ExercisePrescription>
  >(() => initialPrescriptions(initial));
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function changeSelected(exercises: Exercise[]) {
    setSelectedExercises(exercises);
    setPrescriptions((current) =>
      Object.fromEntries(
        exercises.map((exercise) => [
          exercise.id,
          current[exercise.id] ?? defaultPrescription(),
        ]),
      ),
    );
  }

  function moveExercise(index: number, direction: -1 | 1) {
    setSelectedExercises((current) => {
      const destination = index + direction;
      if (destination < 0 || destination >= current.length) return current;
      const next = [...current];
      [next[index], next[destination]] = [next[destination], next[index]];
      return next;
    });
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    const input = {
      name,
      description,
      difficulty,
      category,
      daysPerWeek,
      exercises: selectedExercises.map((exercise, order) => ({
        exerciseId: exercise.id,
        order,
        ...prescriptions[exercise.id],
      })),
    };
    try {
      const result = initial
        ? admin
          ? await adminUpdateWorkoutPlan({ ...input, id: initial.id })
          : await updateWorkoutPlan({ ...input, id: initial.id })
        : admin
          ? await adminCreateWorkoutPlan(input)
          : await createWorkoutPlan(input);
      await router.push(
        admin
          ? `/system-admin/workout-plans/${result.id}`
          : `/workout-plans/${result.id}`,
      );
    } catch {
      setError("The Workout Plan could not be saved. Please review the form.");
      setIsSubmitting(false);
    }
  }

  return (
    <Stack component="form" onSubmit={submit} gap={3}>
      {error && <Alert severity="error">{error}</Alert>}

      <Box>
        <Typography variant="h6">1. Plan basics</Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Give the programme a clear name and explain its training goal.
        </Typography>
        <Stack gap={2}>
          <TextField
            required
            label="Plan name"
            value={name}
            inputProps={{ maxLength: 120 }}
            onChange={(event) => setName(event.target.value)}
          />
          <TextField
            multiline
            minRows={3}
            label="Description"
            value={description}
            inputProps={{ maxLength: 2000 }}
            onChange={(event) => setDescription(event.target.value)}
          />
        </Stack>
      </Box>

      <Divider />

      <Box>
        <Typography variant="h6">2. Schedule and level</Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Describe who the plan is for and how often it should be performed.
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
          <TextField
            select
            label="Difficulty"
            value={difficulty}
            onChange={(event) =>
              setDifficulty(event.target.value as typeof difficulty)
            }
          >
            {["BEGINNER", "INTERMEDIATE", "ADVANCED"].map((value) => (
              <MenuItem value={value} key={value}>
                {value.toLowerCase()}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            required
            label="Category"
            value={category}
            inputProps={{ maxLength: 80 }}
            onChange={(event) => setCategory(event.target.value)}
          />
          <TextField
            required
            type="number"
            label="Days per week"
            value={daysPerWeek}
            inputProps={{ min: 1, max: 7 }}
            onChange={(event) => setDaysPerWeek(Number(event.target.value))}
          />
        </Stack>
      </Box>

      <Divider />

      <Box>
        <Typography variant="h6">3. Build the workout</Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Select at least one exercise, then configure its sets and targets.
        </Typography>
        <WorkoutExercisePicker
          selected={selectedExercises}
          onChange={changeSelected}
          initialExercises={initialExercises}
          emptyDescription="Select at least one exercise to build this Workout Plan."
        />
      </Box>

      {selectedExercises.length > 0 && (
        <WorkoutPlanExercisePrescription
          exercises={selectedExercises}
          prescriptions={prescriptions}
          onPrescriptionChange={(exerciseId, value) =>
            setPrescriptions((current) => ({
              ...current,
              [exerciseId]: value,
            }))
          }
          onMove={moveExercise}
        />
      )}

      <Divider />

      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ sm: "center" }}
        justifyContent="space-between"
        gap={2}
      >
        <Box>
          <Typography fontWeight={700}>
            {selectedExercises.length
              ? `${selectedExercises.length} ${
                  selectedExercises.length === 1 ? "exercise" : "exercises"
                } configured`
              : "Select exercises to continue"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You can edit this plan again at any time.
          </Typography>
        </Box>
        <Button
          disabled={!selectedExercises.length || isSubmitting}
          type="submit"
          variant="contained"
          size="large"
          sx={{ minWidth: { sm: 220 } }}
        >
          {isSubmitting
            ? "Saving…"
            : initial
              ? "Save Workout Plan"
              : "Create Workout Plan"}
        </Button>
      </Stack>
    </Stack>
  );
}
