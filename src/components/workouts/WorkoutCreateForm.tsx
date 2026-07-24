import { Button, Stack, TextField } from "@mui/material";
import { createWorkout } from "fitness/utils/spec";
import type { WorkoutEntryMode } from "fitness/utils/types";
import { useRouter } from "next/router";
import { useState } from "react";

export default function WorkoutCreateForm({ mode }: { mode: WorkoutEntryMode }) {
  const router = useRouter();
  const [name, setName] = useState(mode === "QUICK_ENTRY" ? "Quick workout" : "My workout");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [duration, setDuration] = useState("45");
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const result = await createWorkout({
      name,
      workoutDate: new Date(`${date}T12:00:00`).toISOString(),
      entryMode: mode,
      durationMinutes: mode === "QUICK_ENTRY" ? Number(duration) : undefined,
    });
    await router.push(mode === "QUICK_ENTRY" ? `/workouts/${result.id}/edit` : `/workouts/live/${result.id}`);
  }
  return (
    <Stack component="form" onSubmit={submit} gap={2}>
      <TextField required label="Workout name" value={name} onChange={(event) => setName(event.target.value)} inputProps={{ maxLength: 120 }} />
      <TextField required type="date" label="Workout date" InputLabelProps={{ shrink: true }} value={date} onChange={(event) => setDate(event.target.value)} />
      {mode === "QUICK_ENTRY" && <TextField required type="number" label="Duration (minutes)" value={duration} onChange={(event) => setDuration(event.target.value)} />}
      <Button type="submit" size="large" variant="contained">{mode === "QUICK_ENTRY" ? "Create quick entry" : "Start workout"}</Button>
    </Stack>
  );
}
