// fitness/components/ExerciseSelector.tsx
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { addExerciseToWorkout, getExercises } from "fitness/utils/spec";
import { Exercise } from "fitness/utils/types";
import { useEffect, useState } from "react";

interface Props {
  workoutId: string;
  nextOrder: number;
  onAdded: () => void;
  onCancel: () => void;
}

export default function ExerciseSelector({
  workoutId,
  nextOrder,
  onAdded,
  onCancel,
}: Props) {
  const [search, setSearch] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    setLoading(true);
    try {
      const data = await getExercises(search || undefined);
      setExercises(data);
    } catch (error) {
      console.error("Failed to load exercises:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadExercises();
  };

  const handleSelect = async (exerciseId: string) => {
    setAdding(true);
    try {
      await addExerciseToWorkout(workoutId, {
        exerciseId,
        order: nextOrder,
      });
      onAdded();
    } catch (error) {
      console.error("Failed to add exercise:", error);
      alert("Failed to add exercise");
      setAdding(false);
    }
  };

  return (
    <Paper sx={{ p: 3, border: "2px solid", borderColor: "primary.main" }}>
      <Typography variant="h6" gutterBottom>
        Select Exercise
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search exercises..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          fullWidth
        />
        <Button variant="outlined" onClick={handleSearch} disabled={loading}>
          Search
        </Button>
      </Box>

      <List sx={{ maxHeight: 300, overflow: "auto", mb: 2 }}>
        {exercises.map((exercise) => (
          <ListItem key={exercise.id} disablePadding>
            <ListItemButton
              onClick={() => handleSelect(exercise.id)}
              disabled={adding}
            >
              <ListItemText
                primary={exercise.name}
                secondary={`${exercise.category} • ${exercise.equipment}`}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Button variant="text" onClick={onCancel} disabled={adding}>
        Cancel
      </Button>
    </Paper>
  );
}
