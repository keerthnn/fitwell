import { Button, MenuItem, Stack, TextField } from "@mui/material";
import { adminCreateWorkoutPlan, adminUpdateWorkoutPlan, createWorkoutPlan, getExercises, updateWorkoutPlan } from "fitness/utils/spec";
import type { Exercise, WorkoutPlan } from "fitness/utils/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function WorkoutPlanForm({ initial, admin = false }: { initial?: WorkoutPlan; admin?: boolean }) {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [difficulty, setDifficulty] = useState(initial?.difficulty ?? "BEGINNER");
  const [category, setCategory] = useState(initial?.category ?? "General");
  const [daysPerWeek, setDaysPerWeek] = useState(initial?.daysPerWeek ?? 3);
  const [selected, setSelected] = useState<string[]>(initial?.exercises.map((item) => item.exerciseId) ?? []);
  useEffect(() => { void getExercises({ limit: "100" }).then((result) => setExercises(result.items)); }, []);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const input = {
      name,
      description,
      difficulty,
      category,
      daysPerWeek,
      exercises: selected.map((exerciseId, order) => ({ exerciseId, order, sets: 3, minimumReps: 8, maximumReps: 12 })),
    };
    const result = initial
      ? admin
        ? await adminUpdateWorkoutPlan({ ...input, id: initial.id })
        : await updateWorkoutPlan({ ...input, id: initial.id })
      : admin
        ? await adminCreateWorkoutPlan(input)
        : await createWorkoutPlan(input);
    await router.push(admin ? `/system-admin/workout-plans/${result.id}` : `/workout-plans/${result.id}`);
  }
  return (
    <Stack component="form" onSubmit={submit} gap={2}>
      <TextField required label="Plan name" value={name} onChange={(event) => setName(event.target.value)} />
      <TextField multiline minRows={3} label="Description" value={description} onChange={(event) => setDescription(event.target.value)} />
      <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
        <TextField select fullWidth label="Difficulty" value={difficulty} onChange={(event) => setDifficulty(event.target.value as typeof difficulty)}>{["BEGINNER", "INTERMEDIATE", "ADVANCED"].map((value) => <MenuItem value={value} key={value}>{value}</MenuItem>)}</TextField>
        <TextField fullWidth label="Category" value={category} onChange={(event) => setCategory(event.target.value)} />
        <TextField fullWidth type="number" label="Days per week" value={daysPerWeek} onChange={(event) => setDaysPerWeek(Number(event.target.value))} />
      </Stack>
      <TextField
        select
        SelectProps={{ multiple: true }}
        label="Exercises"
        value={selected}
        onChange={(event) => setSelected(typeof event.target.value === "string" ? event.target.value.split(",") : event.target.value)}
      >
        {exercises.map((exercise) => <MenuItem key={exercise.id} value={exercise.id}>{exercise.name}</MenuItem>)}
      </TextField>
      <Button disabled={!selected.length} type="submit" variant="contained" size="large">{initial ? "Save Workout Plan" : "Create Workout Plan"}</Button>
    </Stack>
  );
}
