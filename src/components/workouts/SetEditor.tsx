import { Add, Delete } from "@mui/icons-material";
import { Button, Checkbox, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import { saveWorkoutExerciseSets } from "fitness/utils/spec";
import type { WorkoutExerciseDetail, WorkoutSet } from "fitness/utils/types";
import { useState } from "react";

const emptySet = (setNumber: number): WorkoutSet => ({
  setNumber,
  reps: null,
  weightKg: null,
  durationSeconds: null,
  distanceMeters: null,
  restSeconds: 90,
  isCompleted: false,
});

export default function SetEditor({ item }: { item: WorkoutExerciseDetail }) {
  const [sets, setSets] = useState<WorkoutSet[]>(item.sets.length ? item.sets : [emptySet(1)]);
  const [saved, setSaved] = useState(false);
  const tracking = item.exercise.trackingType;
  const update = (index: number, value: Partial<WorkoutSet>) =>
    setSets((current) => current.map((set, setIndex) => setIndex === index ? { ...set, ...value } : set));
  const number = (value: string) => value === "" ? null : Number(value);
  const usesReps = ["REPS_WEIGHT", "REPS_ONLY"].includes(tracking);
  const usesWeight = tracking === "REPS_WEIGHT";
  const usesDuration = ["DURATION", "DURATION_DISTANCE"].includes(tracking);
  const usesDistance = ["DISTANCE", "DURATION_DISTANCE"].includes(tracking);
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="h6" mb={2}>{item.exercise.name}</Typography>
      <Stack gap={1.5}>
        {sets.map((set, index) => (
          <Stack key={set.id ?? index} direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "center" }} gap={1}>
            <Typography width={52}>Set {index + 1}</Typography>
            {usesReps && <SetNumber label="Reps" value={set.reps} onChange={(value) => update(index, { reps: value })} parse={number} />}
            {usesWeight && <SetNumber label="Weight (kg)" value={set.weightKg} onChange={(value) => update(index, { weightKg: value })} parse={number} />}
            {usesDuration && <SetNumber label="Duration (sec)" value={set.durationSeconds} onChange={(value) => update(index, { durationSeconds: value })} parse={number} />}
            {usesDistance && <SetNumber label="Distance (m)" value={set.distanceMeters} onChange={(value) => update(index, { distanceMeters: value })} parse={number} />}
            <Stack direction="row" alignItems="center">
              <Checkbox checked={set.isCompleted} onChange={(event) => update(index, { isCompleted: event.target.checked })} inputProps={{ "aria-label": `Complete set ${index + 1}` }} />
              <IconButton aria-label={`Remove set ${index + 1}`} onClick={() => setSets((current) => current.filter((_, setIndex) => setIndex !== index).map((value, setIndex) => ({ ...value, setNumber: setIndex + 1 })))}><Delete /></IconButton>
            </Stack>
          </Stack>
        ))}
        <Stack direction="row" gap={1}>
          <Button startIcon={<Add />} onClick={() => setSets((current) => [...current, emptySet(current.length + 1)])}>Add set</Button>
          <Button variant="contained" disabled={!sets.length} onClick={async () => { await saveWorkoutExerciseSets(item.id, sets.map((set, index) => ({ ...set, setNumber: index + 1 }))); setSaved(true); }}>Save sets</Button>
          {saved && <Typography color="success.main" alignSelf="center">Saved</Typography>}
        </Stack>
      </Stack>
    </Paper>
  );
}

function SetNumber({ label, value, onChange, parse }: { label: string; value: number | null | undefined; onChange: (value: number | null) => void; parse: (value: string) => number | null }) {
  return <TextField size="small" type="number" label={label} value={value ?? ""} onChange={(event) => onChange(parse(event.target.value))} inputProps={{ min: 0 }} />;
}
