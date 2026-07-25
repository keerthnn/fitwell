import { Button, MenuItem, Stack, TextField } from "@mui/material";
import type { Profile } from "fitness/utils/types";
import { canonicalHeight, canonicalWeight, displayHeight, displayWeight } from "fitness/utils/units";
import { useState } from "react";

const defaults: Profile = {
  firstName: "",
  lastName: "",
  gender: null,
  dateOfBirth: null,
  heightCm: null,
  currentWeightKg: null,
  unitSystem: "METRIC",
  fitnessGoal: "GENERAL_FITNESS",
  experienceLevel: "BEGINNER",
  weeklyWorkoutTarget: 3,
  typicalWorkoutDuration: 45,
  preferredWorkoutTime: null,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  onboardingCompleted: false,
};

export default function ProfileForm({
  initial,
  submitLabel,
  onboarding = false,
  onSubmit,
}: {
  initial?: Profile | null;
  submitLabel: string;
  onboarding?: boolean;
  onSubmit: (profile: Profile) => Promise<void>;
}) {
  const [form, setForm] = useState<Profile>({ ...defaults, ...initial });
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof Profile>(key: K, value: Profile[K]) =>
    setForm((current) => ({ ...current, [key]: value }));
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      await onSubmit({ ...form, onboardingCompleted: onboarding || form.onboardingCompleted });
    } finally {
      setSaving(false);
    }
  }
  return (
    <Stack component="form" onSubmit={submit} gap={2.5}>
      <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
        <TextField required fullWidth label="First name" value={form.firstName} onChange={(event) => set("firstName", event.target.value)} />
        <TextField required fullWidth label="Last name" value={form.lastName} onChange={(event) => set("lastName", event.target.value)} />
      </Stack>
      <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
        <TextField fullWidth label="Gender" value={form.gender ?? ""} onChange={(event) => set("gender", event.target.value || null)} />
        <TextField fullWidth type="date" label="Date of birth" InputLabelProps={{ shrink: true }} value={form.dateOfBirth?.slice(0, 10) ?? ""} onChange={(event) => set("dateOfBirth", event.target.value || null)} />
      </Stack>
      <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
        <TextField fullWidth type="number" label={`Height (${form.unitSystem === "IMPERIAL" ? "in" : "cm"})`} value={form.heightCm == null ? "" : Number(displayHeight(form.heightCm, form.unitSystem).toFixed(1))} onChange={(event) => set("heightCm", event.target.value ? canonicalHeight(Number(event.target.value), form.unitSystem) : null)} />
        <TextField fullWidth type="number" label={`Current weight (${form.unitSystem === "IMPERIAL" ? "lb" : "kg"})`} value={form.currentWeightKg == null ? "" : Number(displayWeight(form.currentWeightKg, form.unitSystem).toFixed(1))} onChange={(event) => set("currentWeightKg", event.target.value ? canonicalWeight(Number(event.target.value), form.unitSystem) : null)} />
      </Stack>
      <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
        <TextField select fullWidth label="Fitness goal" value={form.fitnessGoal} onChange={(event) => set("fitnessGoal", event.target.value as Profile["fitnessGoal"])}>
          {["LOSE_FAT", "BUILD_MUSCLE", "IMPROVE_STRENGTH", "IMPROVE_ENDURANCE", "MAINTAIN_FITNESS", "GENERAL_FITNESS"].map((value) => <MenuItem key={value} value={value}>{value.replaceAll("_", " ")}</MenuItem>)}
        </TextField>
        <TextField select fullWidth label="Experience" value={form.experienceLevel} onChange={(event) => set("experienceLevel", event.target.value as Profile["experienceLevel"])}>
          {["BEGINNER", "INTERMEDIATE", "ADVANCED"].map((value) => <MenuItem key={value} value={value}>{value}</MenuItem>)}
        </TextField>
      </Stack>
      <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
        <TextField fullWidth type="number" label="Workouts per week" value={form.weeklyWorkoutTarget} onChange={(event) => set("weeklyWorkoutTarget", Number(event.target.value))} />
        <TextField fullWidth type="number" label="Typical duration (minutes)" value={form.typicalWorkoutDuration ?? ""} onChange={(event) => set("typicalWorkoutDuration", event.target.value ? Number(event.target.value) : null)} />
        <TextField select fullWidth label="Units" value={form.unitSystem} onChange={(event) => set("unitSystem", event.target.value as Profile["unitSystem"])}>
          <MenuItem value="METRIC">Metric</MenuItem><MenuItem value="IMPERIAL">Imperial</MenuItem>
        </TextField>
      </Stack>
      <Button type="submit" size="large" variant="contained" disabled={saving}>{saving ? "Saving…" : submitLabel}</Button>
    </Stack>
  );
}
