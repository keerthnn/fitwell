import { Button, MenuItem, Stack, TextField } from "@mui/material";
import { adminCreateExercise, adminUpdateExercise } from "fitness/utils/spec";
import type { Exercise, TrackingType } from "fitness/utils/types";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ExerciseAdminForm({ initial }: { initial?: Exercise }) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [instructions, setInstructions] = useState(initial?.instructions ?? "");
  const [equipment, setEquipment] = useState(initial?.equipment ?? "DUMBBELL");
  const [movement, setMovement] = useState(initial?.movement ?? "PUSH");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [primaryMuscle, setPrimaryMuscle] = useState(initial?.primaryMuscle ?? "");
  const [trackingType, setTrackingType] = useState<TrackingType>(initial?.trackingType ?? "REPS_WEIGHT");
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const data = {
      name, description, instructions, equipment, movement, category,
      primaryMuscle, trackingType, secondaryMuscles: initial?.secondaryMuscles ?? [],
      isCompound: initial?.isCompound ?? true,
      imagePath: initial?.imagePath, thumbnailPath: initial?.thumbnailPath,
      equipmentImagePath: initial?.equipmentImagePath,
    };
    const result = initial
      ? await adminUpdateExercise({ ...data, id: initial.id })
      : await adminCreateExercise(data);
    await router.push(`/system-admin/exercises/${result.id}`);
  }
  return (
    <Stack component="form" onSubmit={submit} gap={2}>
      <TextField required label="Name" value={name} onChange={(event) => setName(event.target.value)} />
      <TextField multiline minRows={2} label="Description" value={description} onChange={(event) => setDescription(event.target.value)} />
      <TextField multiline minRows={3} label="Instructions" value={instructions} onChange={(event) => setInstructions(event.target.value)} />
      <Stack direction={{ xs: "column", md: "row" }} gap={2}>
        <TextField select label="Equipment" value={equipment} onChange={(event) => setEquipment(event.target.value)}>{["BARBELL", "DUMBBELL", "KETTLEBELL", "MACHINE", "BODYWEIGHT", "CABLE"].map((value) => <MenuItem key={value} value={value}>{value}</MenuItem>)}</TextField>
        <TextField select label="Movement" value={movement} onChange={(event) => setMovement(event.target.value)}>{["PUSH", "PULL", "SQUAT", "HINGE", "LUNGE", "ROTATION", "CARRY", "ISOMETRIC"].map((value) => <MenuItem key={value} value={value}>{value}</MenuItem>)}</TextField>
      </Stack>
      <Stack direction={{ xs: "column", md: "row" }} gap={2}>
        <TextField required label="Category" value={category} onChange={(event) => setCategory(event.target.value)} />
        <TextField required label="Primary muscle" value={primaryMuscle} onChange={(event) => setPrimaryMuscle(event.target.value)} />
        <TextField select label="Tracking type" value={trackingType} onChange={(event) => setTrackingType(event.target.value as TrackingType)}>{["REPS_WEIGHT", "REPS_ONLY", "DURATION", "DISTANCE", "DURATION_DISTANCE"].map((value) => <MenuItem key={value} value={value}>{value.replaceAll("_", " ")}</MenuItem>)}</TextField>
      </Stack>
      <Button type="submit" variant="contained">{initial ? "Save exercise" : "Create exercise"}</Button>
    </Stack>
  );
}
