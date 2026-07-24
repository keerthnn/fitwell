import {
  Alert,
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import WorkoutExercisePicker from "fitness/components/workouts/WorkoutExercisePicker";
import { createWorkout } from "fitness/utils/spec";
import type { Exercise, WorkoutEntryMode } from "fitness/utils/types";
import { useRouter } from "next/router";
import { useState } from "react";

export default function WorkoutCreateForm({
  mode,
  initialExercises,
}: {
  mode: WorkoutEntryMode;
  initialExercises?: Exercise[];
}) {
  const router = useRouter();
  const [name, setName] = useState(mode === "QUICK_ENTRY" ? "Quick workout" : "My workout");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [duration, setDuration] = useState("45");
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const result = await createWorkout({
        name,
        workoutDate: new Date(`${date}T12:00:00`).toISOString(),
        entryMode: mode,
        durationMinutes: mode === "QUICK_ENTRY" ? Number(duration) : undefined,
        exerciseIds:
          mode === "LIVE"
            ? selectedExercises.map((exercise) => exercise.id)
            : undefined,
      });
      await router.push(
        mode === "QUICK_ENTRY"
          ? `/workouts/${result.id}/edit`
          : `/workouts/live/${result.id}`,
      );
    } catch {
      setError("The workout could not be created. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <Stack component="form" onSubmit={submit} gap={3}>
      {error && <Alert severity="error">{error}</Alert>}

      <Box>
        <Typography variant="h6">
          {mode === "LIVE" ? "1. Session details" : "Workout details"}
        </Typography>
        <Typography color="text.secondary" variant="body2" mb={2}>
          {mode === "LIVE"
            ? "Give this workout a recognizable name and confirm the date."
            : "Enter the details for the completed workout."}
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
          <TextField
            required
            label="Workout name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            inputProps={{ maxLength: 120 }}
          />
          <TextField
            required
            type="date"
            label="Workout date"
            InputLabelProps={{ shrink: true }}
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
          {mode === "QUICK_ENTRY" && (
            <TextField
              required
              type="number"
              label="Duration (minutes)"
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
            />
          )}
        </Stack>
      </Box>

      {mode === "LIVE" && (
        <>
          <Divider />
          <Box>
            <Typography variant="h6">2. Choose exercises</Typography>
            <Typography color="text.secondary" variant="body2" mb={2}>
              This is optional—you can add or change exercises during the
              workout.
            </Typography>
            <WorkoutExercisePicker
              selected={selectedExercises}
              onChange={setSelectedExercises}
              initialExercises={initialExercises}
            />
          </Box>
        </>
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
            {mode === "QUICK_ENTRY"
              ? "Ready to record this workout?"
              : selectedExercises.length
                ? `${selectedExercises.length} ${
                    selectedExercises.length === 1 ? "exercise" : "exercises"
                  } selected`
                : "Starting without exercises"}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {mode === "LIVE"
              ? "Sets and weights are entered in the live workout."
              : "You can add exercise details after creating the entry."}
          </Typography>
        </Box>
        <Button
          type="submit"
          size="large"
          variant="contained"
          disabled={isSubmitting}
          sx={{ minWidth: { sm: 220 } }}
        >
          {isSubmitting
            ? "Creating…"
            : mode === "QUICK_ENTRY"
              ? "Create quick entry"
              : selectedExercises.length
                ? `Start with ${selectedExercises.length} ${
                    selectedExercises.length === 1 ? "exercise" : "exercises"
                  }`
                : "Start empty workout"}
        </Button>
      </Stack>
    </Stack>
  );
}
