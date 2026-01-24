import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import ExerciseBlock from "fitness/components/ExerciseBlock";
import ExerciseSelector from "fitness/components/ExerciseSelector";
import { getWorkoutById } from "fitness/utils/spec";
import { Workout } from "fitness/utils/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditWorkout() {
  const router = useRouter();
  const { id } = router.query;

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);

  useEffect(() => {
    if (typeof id === "string") {
      loadWorkout();
    }
  }, [id]);

  const loadWorkout = async () => {
    try {
      const data = await getWorkoutById(id as string);
      setWorkout(data);
    } catch (error) {
      console.error("Failed to load workout:", error);
      alert("Failed to load workout");
    } finally {
      setLoading(false);
    }
  };

  const handleExerciseAdded = () => {
    setShowExerciseSelector(false);
    loadWorkout();
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!workout) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography>Workout not found</Typography>
      </Container>
    );
  }

  const formattedDate = new Date(workout.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            {workout.title || "Untitled Workout"}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {formattedDate}
          </Typography>
          {workout.notes && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {workout.notes}
            </Typography>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {workout.exercises.map((exercise) => (
            <ExerciseBlock
              key={exercise.id}
              workoutExercise={exercise}
              onUpdate={loadWorkout}
            />
          ))}

          {showExerciseSelector ? (
            <ExerciseSelector
              workoutId={workout.id}
              nextOrder={workout.exercises.length + 1}
              onAdded={handleExerciseAdded}
              onCancel={() => setShowExerciseSelector(false)}
            />
          ) : (
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setShowExerciseSelector(true)}
            >
              Add Exercise
            </Button>
          )}
        </Box>

        <Box sx={{ mt: 4 }}>
          <Button variant="text" onClick={() => router.push("/workouts")}>
            Back to Workouts
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
