import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import { AdminLayout } from "fitness/components/AdminLayout";
import { AdminPageGuard } from "fitness/components/AdminPageGuard";
import {
  exerciseCatalog,
  exerciseMuscleGroups,
  getExerciseMuscleGroup,
  getMuscleGroupImageSource,
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
  const [actionMenuAnchor, setActionMenuAnchor] = useState<HTMLElement | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

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
    if (!confirm("Delete this exercise from the library?")) return;

    try {
      await adminDeleteExercise(id);
      await load();
    } catch (error) {
      console.error("Failed to delete exercise:", error);
      alert("Failed to delete exercise.");
    }
  }

  const exerciseKey = (exercise: Pick<Exercise, "name" | "equipment">) =>
    `${exercise.name}:${exercise.equipment}`;

  const existingExerciseKeys = new Set(exercises.map(exerciseKey));
  const catalogExercises = exerciseCatalog.filter(
    (exercise) =>
      catalogCategory === "All" ||
      getExerciseMuscleGroup(exercise)?.label === catalogCategory,
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

  const openExerciseActions = (
    event: React.MouseEvent<HTMLElement>,
    exercise: Exercise,
  ) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedExercise(exercise);
  };

  const closeExerciseActions = () => {
    setActionMenuAnchor(null);
    setSelectedExercise(null);
  };

  const editSelectedExercise = () => {
    if (!selectedExercise) return;
    setForm(selectedExercise);
    closeExerciseActions();
  };

  const deleteSelectedExercise = () => {
    if (!selectedExercise) return;
    const exerciseId = selectedExercise.id;
    closeExerciseActions();
    void remove(exerciseId);
  };

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
                  {exerciseMuscleGroups.map((group) => (
                    <Button
                      key={group.label}
                      size="small"
                      variant={form.category === group.category && form.region === group.region ? "contained" : "outlined"}
                      startIcon={<Box component="img" src={group.imageSrc} alt="" aria-hidden="true" sx={{ width: 32, height: 32, objectFit: "contain" }} />}
                      onClick={() => setForm({ ...form, category: group.category, region: group.region })}
                    >
                      {group.label}
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
                  {exerciseMuscleGroups.map((group) => (
                    <Button
                      key={group.label}
                      size="small"
                      variant={catalogCategory === group.label ? "contained" : "outlined"}
                      startIcon={<Box component="img" src={group.imageSrc} alt="" aria-hidden="true" sx={{ width: 32, height: 32, objectFit: "contain" }} />}
                      onClick={() => setCatalogCategory(group.label)}
                    >
                      {group.label}
                    </Button>
                  ))}
                </Stack>
                <Box sx={{ display: { xs: "block", md: "none" } }}>
                  <Stack spacing={1}>
                    {catalogExercises.map((exercise) => {
                      const key = exerciseKey(exercise);
                      const alreadyAdded = existingExerciseKeys.has(key);

                      return (
                        <Paper key={key} variant="outlined" sx={{ p: 2 }}>
                          <Stack direction="row" spacing={2} alignItems="center">
                            {getMuscleGroupImageSource(exercise) && (
                              <Box
                                component="img"
                                src={getMuscleGroupImageSource(exercise)}
                                alt=""
                                aria-hidden="true"
                                sx={{ width: 36, height: 36, objectFit: "contain" }}
                              />
                            )}
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography fontWeight={600}>{exercise.name}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {getExerciseMuscleGroup(exercise)?.label ?? exercise.category} • {exercise.equipment}
                              </Typography>
                            </Box>
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
                          </Stack>
                        </Paper>
                      );
                    })}
                  </Stack>
                </Box>
                <Table size="small" sx={{ display: { xs: "none", md: "table" } }}>
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
                          <TableCell>
                            <Stack direction="row" spacing={1} alignItems="center">
                              {getMuscleGroupImageSource(exercise) && (
                                <Box
                                  component="img"
                                  src={getMuscleGroupImageSource(exercise)}
                                  alt=""
                                  aria-hidden="true"
                                  sx={{ width: 28, height: 28, objectFit: "contain" }}
                                />
                              )}
                              <Typography variant="body2">{exercise.name}</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>{getExerciseMuscleGroup(exercise)?.label ?? exercise.category}</TableCell>
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
                <Box sx={{ display: { xs: "block", md: "none" }, p: 2 }}>
                  <Stack spacing={1}>
                    {exercises.map((exercise) => (
                      <Paper key={exercise.id} variant="outlined" sx={{ p: 2 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          {getMuscleGroupImageSource(exercise) && (
                            <Box
                              component="img"
                              src={getMuscleGroupImageSource(exercise)}
                              alt=""
                              aria-hidden="true"
                              sx={{ width: 36, height: 36, objectFit: "contain" }}
                            />
                          )}
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography fontWeight={600}>{exercise.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {getExerciseMuscleGroup(exercise)?.label ?? exercise.category} • {exercise.equipment} • {exercise.movement}
                            </Typography>
                          </Box>
                          <Tooltip title="Exercise actions">
                            <IconButton
                              aria-label={`Actions for ${exercise.name}`}
                              onClick={(event) => openExerciseActions(event, exercise)}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                </Box>
                <Table sx={{ display: { xs: "none", md: "table" } }}>
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
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          {getMuscleGroupImageSource(e) && (
                            <Box
                              component="img"
                              src={getMuscleGroupImageSource(e)}
                              alt=""
                              aria-hidden="true"
                              sx={{ width: 28, height: 28, objectFit: "contain" }}
                            />
                          )}
                          <Typography variant="body2">{e.name}</Typography>
                        </Stack>
                      </TableCell>
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
                          {getExerciseMuscleGroup(e)?.label ?? e.category}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                        >
                          <Tooltip title="Exercise actions">
                            <IconButton
                              size="small"
                              aria-label={`Actions for ${e.name}`}
                              onClick={(event) => openExerciseActions(event, e)}
                            >
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                </Table>
              </Paper>
              <Menu
                anchorEl={actionMenuAnchor}
                open={Boolean(actionMenuAnchor && selectedExercise)}
                onClose={closeExerciseActions}
              >
                <MenuItem onClick={editSelectedExercise}>Edit</MenuItem>
                <MenuItem onClick={deleteSelectedExercise} sx={{ color: "error.main" }}>
                  Delete
                </MenuItem>
              </Menu>
            </Stack>
          </Container>
        </Box>
      </AdminLayout>
    </AdminPageGuard>
  );
}
