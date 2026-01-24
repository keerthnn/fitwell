// fitness/components/ExerciseBlock.tsx
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { deleteWorkoutExercises, saveWorkoutExercisesSets } from "fitness/utils/spec";
import { WorkoutExerciseDetail } from "fitness/utils/types";
import { useState } from "react";

interface Props {
  workoutExercise: WorkoutExerciseDetail;
  onUpdate: () => void;
}

interface SetRow {
  setNumber: number;
  reps: string;
  weightKg: string;
  rpe: string;
}

export default function ExerciseBlock({ workoutExercise, onUpdate }: Props) {
  const [sets, setSets] = useState<SetRow[]>(() => {
    if (workoutExercise.sets.length > 0) {
      return workoutExercise.sets.map((s) => ({
        setNumber: s.setNumber,
        reps: s.reps?.toString() || "",
        weightKg: s.weightKg?.toString() || "",
        rpe: s.rpe?.toString() || "",
      }));
    }
    return [{ setNumber: 1, reps: "", weightKg: "", rpe: "" }];
  });

  const [saving, setSaving] = useState(false);

  const addSet = () => {
    setSets([
      ...sets,
      { setNumber: sets.length + 1, reps: "", weightKg: "", rpe: "" },
    ]);
  };

  const removeSet = (index: number) => {
    const newSets = sets.filter((_, i) => i !== index);
    const renumbered = newSets.map((s, i) => ({ ...s, setNumber: i + 1 }));
    setSets(renumbered);
  };

  const updateSet = (index: number, field: keyof SetRow, value: string) => {
    const newSets = [...sets];
    newSets[index] = { ...newSets[index], [field]: value };
    setSets(newSets);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveWorkoutExercisesSets(workoutExercise.id, {
        sets: sets.map((s) => ({
          setNumber: s.setNumber,
          reps: s.reps ? parseInt(s.reps) : undefined,
          weightKg: s.weightKg ? parseFloat(s.weightKg) : undefined,
          rpe: s.rpe ? parseFloat(s.rpe) : undefined,
        })),
      });
      onUpdate();
    } catch (error) {
      console.error("Failed to save sets:", error);
      alert("Failed to save sets");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm("Remove this exercise from the workout?")) return;
    try {
      await deleteWorkoutExercises(workoutExercise.id);
      onUpdate();
    } catch (error) {
      console.error("Failed to remove exercise:", error);
      alert("Failed to remove exercise");
    }
  };

  return (
    <Paper sx={{ p: 3, border: "2px solid", borderColor: "divider" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box>
          <Typography variant="h6">{workoutExercise.exercise.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {workoutExercise.exercise.category} •{" "}
            {workoutExercise.exercise.equipment}
          </Typography>
        </Box>
        <IconButton size="small" onClick={handleRemove} color="error">
          <DeleteIcon />
        </IconButton>
      </Box>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Set</TableCell>
            <TableCell>Reps</TableCell>
            <TableCell>Weight (kg)</TableCell>
            <TableCell>RPE</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sets.map((set, index) => (
            <TableRow key={index}>
              <TableCell>{set.setNumber}</TableCell>
              <TableCell>
                <TextField
                  size="small"
                  type="number"
                  value={set.reps}
                  onChange={(e) => updateSet(index, "reps", e.target.value)}
                  inputProps={{ min: 0 }}
                  sx={{ width: 80 }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  type="number"
                  value={set.weightKg}
                  onChange={(e) => updateSet(index, "weightKg", e.target.value)}
                  inputProps={{ min: 0, step: 0.5 }}
                  sx={{ width: 100 }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  type="number"
                  value={set.rpe}
                  onChange={(e) => updateSet(index, "rpe", e.target.value)}
                  inputProps={{ min: 0, max: 10, step: 0.5 }}
                  sx={{ width: 80 }}
                />
              </TableCell>
              <TableCell>
                <IconButton
                  size="small"
                  onClick={() => removeSet(index)}
                  disabled={sets.length === 1}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<AddIcon />}
          onClick={addSet}
        >
          Add Set
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Exercise"}
        </Button>
      </Box>
    </Paper>
  );
}
