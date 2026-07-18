import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { AdminLayout } from "fitness/components/AdminLayout";
import { AdminPageGuard } from "fitness/components/AdminPageGuard";
import {
  exerciseCatalog,
  exerciseCategories,
  type ExerciseCatalogItem,
} from "fitness/utils/exerciseCatalog";
import {
  adminCreateExercise,
  adminDeleteExercise,
  adminUpdateExercise,
  getExercises,
} from "fitness/utils/spec";
import { Exercise } from "fitness/utils/types";
import { useEffect, useState } from "react";

const emptyForm: Partial<Exercise> = {
  name: "",
  equipment: "BARBELL",
  movement: "PUSH",
  category: "",
  region: "",
  isCompound: true,
};

const equipmentOptions = [
  "BARBELL",
  "DUMBBELL",
  "KETTLEBELL",
  "MACHINE",
  "BODYWEIGHT",
  "CABLE",
];

const movementOptions = [
  "PUSH",
  "PULL",
  "SQUAT",
  "HINGE",
  "LUNGE",
  "ROTATION",
  "CARRY",
  "ISOMETRIC",
];

export default function AdminExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [form, setForm] = useState<Partial<Exercise>>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [catalogCategory, setCatalogCategory] = useState<string>("All");
  const [addingCatalogExercise, setAddingCatalogExercise] = useState<string | null>(null);

  async function load() {
    setExercises(await getExercises());
  }

  useEffect(() => {
    let mounted = true;

    (async () => {
      const data = await getExercises();
      if (mounted) setExercises(data);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  async function submit() {
    if (!form.name?.trim() || !form.category) {
      alert("Enter an exercise name and select a muscle group.");
      return;
    }

    setSaving(true);
    try {
      if (form.id) {
        await adminUpdateExercise(form as Exercise);
      } else {
        await adminCreateExercise({ ...form, name: form.name.trim() });
      }
      setForm(emptyForm);
      await load();
    } catch (error) {
      console.error("Failed to save exercise:", error);
      alert("Failed to save exercise. It may already exist with this equipment.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    await adminDeleteExercise(id);
    await load();
  }

  const exerciseKey = (exercise: Pick<Exercise, "name" | "equipment">) =>
    `${exercise.name}:${exercise.equipment}`;

  const existingExerciseKeys = new Set(exercises.map(exerciseKey));
  const catalogExercises = exerciseCatalog.filter(
    (exercise) => catalogCategory === "All" || exercise.category === catalogCategory,
  );

  async function addCatalogExercise(exercise: ExerciseCatalogItem) {
    const key = exerciseKey(exercise);
    setAddingCatalogExercise(key);
    try {
      await adminCreateExercise(exercise);
      await load();
    } catch (error) {
      console.error("Failed to add catalog exercise:", error);
      alert("Failed to add exercise. It may already be in the library.");
    } finally {
      setAddingCatalogExercise(null);
    }
  }

  return (
    <AdminPageGuard>
      <AdminLayout>
        <Box sx={{ py: 4 }}>
          <Container maxWidth="lg">
            <Stack spacing={3}>
              <Box>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  Exercises
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Add exercises to the shared workout library.
                </Typography>
              </Box>

              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {form.id ? "Edit Exercise" : "Add Exercise"}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Choose a muscle group first, then enter the exercise details.
                </Typography>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 3 }}>
                  {exerciseCategories.map((category) => (
                    <Button
                      key={category}
                      size="small"
                      variant={form.category === category ? "contained" : "outlined"}
                      onClick={() => setForm({ ...form, category })}
                    >
                      {category}
                    </Button>
                  ))}
                </Stack>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, minmax(0, 1fr))",
                      md: "repeat(3, minmax(0, 1fr))",
                    },
                    gap: 2,
                  }}
                >
                <TextField
                  label="Exercise name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                <TextField
                  select
                  label="Equipment"
                  value={form.equipment}
                  onChange={(e) =>
                    setForm({ ...form, equipment: e.target.value })
                  }
                  SelectProps={{ native: true }}
                >
                  {equipmentOptions.map((equipment) => (
                    <option key={equipment} value={equipment}>
                      {equipment.charAt(0) + equipment.slice(1).toLowerCase()}
                    </option>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Movement"
                  value={form.movement}
                  onChange={(e) => setForm({ ...form, movement: e.target.value })}
                  SelectProps={{ native: true }}
                >
                  {movementOptions.map((movement) => (
                    <option key={movement} value={movement}>
                      {movement.charAt(0) + movement.slice(1).toLowerCase()}
                    </option>
                  ))}
                </TextField>
                <TextField
                  label="Target area (optional)"
                  value={form.region}
                  onChange={(e) => setForm({ ...form, region: e.target.value })}
                />
                </Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form.isCompound ?? true}
                      onChange={(e) =>
                        setForm({ ...form, isCompound: e.target.checked })
                      }
                    />
                  }
                  label="Compound exercise"
                  sx={{ mt: 1 }}
                />
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={submit}
                  disabled={saving}
                  sx={{ minWidth: 120 }}
                >
                  {saving ? "Saving..." : form.id ? "Update" : "Add Exercise"}
                </Button>
                {form.id && (
                  <Button
                    variant="outlined"
                    onClick={() => setForm(emptyForm)}
                    sx={{ minWidth: 100 }}
                  >
                    Cancel
                  </Button>
                )}
                </Stack>
              </Paper>

              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Workout Exercise Catalog
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Choose from the predefined exercise list and add an item to the shared library in one click.
                </Typography>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 2 }}>
                  <Button
                    size="small"
                    variant={catalogCategory === "All" ? "contained" : "outlined"}
                    onClick={() => setCatalogCategory("All")}
                  >
                    All
                  </Button>
                  {exerciseCategories.map((category) => (
                    <Button
                      key={category}
                      size="small"
                      variant={catalogCategory === category ? "contained" : "outlined"}
                      onClick={() => setCatalogCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </Stack>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Exercise</TableCell>
                      <TableCell>Muscle Group</TableCell>
                      <TableCell>Equipment</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {catalogExercises.map((exercise) => {
                      const key = exerciseKey(exercise);
                      const alreadyAdded = existingExerciseKeys.has(key);

                      return (
                        <TableRow key={key}>
                          <TableCell>{exercise.name}</TableCell>
                          <TableCell>{exercise.category}</TableCell>
                          <TableCell>{exercise.equipment}</TableCell>
                          <TableCell align="right">
                            <Button
                              size="small"
                              variant={alreadyAdded ? "outlined" : "contained"}
                              disabled={alreadyAdded || addingCatalogExercise === key}
                              onClick={() => addCatalogExercise(exercise)}
                            >
                              {alreadyAdded
                                ? "Added"
                                : addingCatalogExercise === key
                                  ? "Adding..."
                                  : "Add"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Paper>

              <Paper>
                <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        Name
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        Equipment
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        Movement
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        Category
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600}>
                        Actions
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {exercises.map((e) => (
                    <TableRow
                      key={e.id}
                      sx={{
                        "&:hover": {
                          backgroundColor: "action.hover",
                        },
                      }}
                    >
                      <TableCell>{e.name}</TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {e.equipment}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {e.movement}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {e.category}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                        >
                          <Button size="small" onClick={() => setForm(e)}>
                            Edit
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => remove(e.id)}
                          >
                            Delete
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                </Table>
              </Paper>
            </Stack>
          </Container>
        </Box>
      </AdminLayout>
    </AdminPageGuard>
  );
}
