import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { deleteWorkout, getWorkoutById } from "fitness/utils/spec";
import { Workout } from "fitness/utils/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ViewWorkout() {
  const router = useRouter();
  const { id } = router.query;

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async () => {
    if (!confirm("Delete this workout? This cannot be undone.")) return;
    try {
      await deleteWorkout(id as string);
      router.push("/workouts");
    } catch (error) {
      console.error("Failed to delete workout:", error);
      alert("Failed to delete workout");
    }
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
          {workout.durationM && (
            <Typography variant="body2" color="text.secondary">
              Duration: {workout.durationM} minutes
            </Typography>
          )}
          {workout.notes && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {workout.notes}
            </Typography>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        {workout.exercises.length === 0 ? (
          <Typography color="text.secondary">No exercises logged</Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {workout.exercises.map((exercise, idx) => (
              <Box key={exercise.id}>
                <Typography variant="h6" gutterBottom>
                  {idx + 1}. {exercise.exercise.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {exercise.exercise.category} • {exercise.exercise.equipment}
                </Typography>

                {exercise.sets.length > 0 ? (
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Set</TableCell>
                        <TableCell>Reps</TableCell>
                        <TableCell>Weight (kg)</TableCell>
                        <TableCell>RPE</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {exercise.sets.map((set) => (
                        <TableRow key={set.id}>
                          <TableCell>{set.setNumber}</TableCell>
                          <TableCell>{set.reps || "-"}</TableCell>
                          <TableCell>{set.weightKg || "-"}</TableCell>
                          <TableCell>{set.rpe || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No sets logged
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        )}

        <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => router.push(`/workouts/${id}/edit`)}
          >
            Edit Workout
          </Button>
          <Button variant="outlined" color="error" onClick={handleDelete}>
            Delete
          </Button>
          <Button variant="text" onClick={() => router.push("/workouts")}>
            Back to Workouts
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
