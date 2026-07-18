import { ViewModule } from "@mui/icons-material";
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
import {
  exerciseMuscleGroups,
  getExerciseMuscleGroup,
  getMuscleGroupImageSource,
} from "fitness/utils/exerciseCatalog";
import {
  addExerciseToWorkout,
  getExercises,
  getHealthRecords,
} from "fitness/utils/spec";
import { Exercise, Injury } from "fitness/utils/types";
import { useCallback, useEffect, useState } from "react";

interface Props {
  workoutId: string;
  nextOrder: number;
  onAdded: () => void;
  onCancel: () => void;
}

const muscleGroups: Array<{
  label: string;
  icon?: typeof ViewModule;
  imageSrc?: string;
}> = [{ label: "All", icon: ViewModule }, ...exerciseMuscleGroups];

export default function ExerciseSelector({
  workoutId,
  nextOrder,
  onAdded,
  onCancel,
}: Props) {
  const [search, setSearch] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [injuries, setInjuries] = useState<Injury[]>([]);

  const loadExercises = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getExercises(search || undefined);
      setExercises(data);
    } catch (error) {
      console.error("Failed to load exercises:", error);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadExercises();
    getHealthRecords().then((data) =>
      setInjuries(
        data.injuries.filter((injury) => injury.status !== "RESOLVED"),
      ),
    );
  }, [loadExercises]);

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

  const visibleExercises = exercises.filter(
    (exercise) =>
      selectedCategory === "All" ||
      getExerciseMuscleGroup(exercise)?.label === selectedCategory,
  );

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

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            sm: "repeat(3, minmax(0, 1fr))",
            md: "repeat(5, minmax(0, 1fr))",
          },
          gap: 1,
          mb: 2,
        }}
      >
        {muscleGroups.map(({ label, icon: Icon, imageSrc }) => (
          <Button
            key={label}
            size="small"
            variant={selectedCategory === label ? "contained" : "outlined"}
            startIcon={
              imageSrc ? (
                <Box
                  component="img"
                  src={imageSrc}
                  alt=""
                  aria-hidden="true"
                  sx={{ width: 34, height: 34, objectFit: "contain" }}
                />
              ) : (
                Icon && <Icon fontSize="small" />
              )
            }
            onClick={() => setSelectedCategory(label)}
            sx={{ minWidth: 0, px: 1, justifyContent: "flex-start" }}
          >
            {label}
          </Button>
        ))}
      </Box>

      <List sx={{ maxHeight: 300, overflow: "auto", mb: 2 }}>
        {visibleExercises.map((exercise) => (
          <ListItem key={exercise.id} disablePadding>
            <ListItemButton
              onClick={() => handleSelect(exercise.id)}
              disabled={adding}
            >
              {getMuscleGroupImageSource(exercise) && (
                <Box
                  component="img"
                  src={getMuscleGroupImageSource(exercise)}
                  alt=""
                  aria-hidden="true"
                  sx={{
                    width: 48,
                    height: 48,
                    objectFit: "contain",
                    mr: 2,
                    flexShrink: 0,
                  }}
                />
              )}
              <ListItemText
                primary={exercise.name}
                secondary={`${getExerciseMuscleGroup(exercise)?.label ?? exercise.category} • ${exercise.equipment}${injuries.some((injury) => injury.exercisesToAvoid.some((name) => exercise.name.toLowerCase().includes(name.toLowerCase())) || injury.contraindicationTags.some((tag) => exercise.contraindicationTags?.includes(tag))) ? " • ⚠ Check active injury guidance" : ""}`}
              />
            </ListItemButton>
          </ListItem>
        ))}
        {!loading && visibleExercises.length === 0 && (
          <Typography color="text.secondary" sx={{ py: 2 }}>
            No exercises found for this muscle group.
          </Typography>
        )}
      </List>

      <Button variant="text" onClick={onCancel} disabled={adding}>
        Cancel
      </Button>
    </Paper>
  );
}
