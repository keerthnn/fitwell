import { Button, MenuItem, Stack, TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { type Dayjs } from "dayjs";
import type { Profile } from "fitness/utils/types";
import {
  canonicalHeight,
  canonicalWeight,
  displayHeight,
  displayWeight,
} from "fitness/utils/units";
import { useState } from "react";

const genderOptions = ["Male", "Female", "Prefer not to say"];

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
  const [dateOfBirth, setDateOfBirth] = useState<Dayjs | null>(() =>
    initial?.dateOfBirth ? dayjs(initial.dateOfBirth) : null,
  );
  const [dateOfBirthHasError, setDateOfBirthHasError] = useState(false);
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof Profile>(key: K, value: Profile[K]) =>
    setForm((current) => ({ ...current, [key]: value }));
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      await onSubmit({
        ...form,
        onboardingCompleted: onboarding || form.onboardingCompleted,
      });
    } finally {
      setSaving(false);
    }
  }
  return (
    <Stack component="form" onSubmit={submit} gap={2.5}>
      <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
        <TextField
          required
          fullWidth
          label="First name"
          value={form.firstName}
          onChange={(event) => set("firstName", event.target.value)}
        />
        <TextField
          required
          fullWidth
          label="Last name"
          value={form.lastName}
          onChange={(event) => set("lastName", event.target.value)}
        />
      </Stack>
      <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
        <TextField
          select
          fullWidth
          label="Gender"
          value={form.gender ?? ""}
          onChange={(event) => set("gender", event.target.value || null)}
        >
          <MenuItem value="">Select an option</MenuItem>
          {genderOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date of birth"
            value={dateOfBirth}
            onChange={(value) => {
              setDateOfBirth(value);
              if (!value || value.isValid()) {
                set("dateOfBirth", value?.format("YYYY-MM-DD") ?? null);
              }
            }}
            onError={(error) => setDateOfBirthHasError(error !== null)}
            disableFuture
            minDate={dayjs().subtract(120, "year")}
            maxDate={dayjs()}
            referenceDate={dayjs().subtract(25, "year")}
            openTo="year"
            views={["year", "month", "day"]}
            format="DD MMM YYYY"
            slotProps={{
              field: { clearable: true },
              textField: {
                fullWidth: true,
                helperText: dateOfBirthHasError
                  ? "Enter a valid date of birth"
                  : "Choose from the calendar or type the date",
              },
            }}
          />
        </LocalizationProvider>
      </Stack>
      <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
        <TextField
          fullWidth
          type="number"
          label={`Height (${form.unitSystem === "IMPERIAL" ? "in" : "cm"})`}
          value={
            form.heightCm == null
              ? ""
              : Number(displayHeight(form.heightCm, form.unitSystem).toFixed(1))
          }
          onChange={(event) =>
            set(
              "heightCm",
              event.target.value
                ? canonicalHeight(Number(event.target.value), form.unitSystem)
                : null,
            )
          }
        />
        <TextField
          fullWidth
          type="number"
          label={`Current weight (${form.unitSystem === "IMPERIAL" ? "lb" : "kg"})`}
          value={
            form.currentWeightKg == null
              ? ""
              : Number(
                  displayWeight(form.currentWeightKg, form.unitSystem).toFixed(
                    1,
                  ),
                )
          }
          onChange={(event) =>
            set(
              "currentWeightKg",
              event.target.value
                ? canonicalWeight(Number(event.target.value), form.unitSystem)
                : null,
            )
          }
        />
      </Stack>
      <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
        <TextField
          select
          fullWidth
          label="Fitness goal"
          value={form.fitnessGoal}
          onChange={(event) =>
            set("fitnessGoal", event.target.value as Profile["fitnessGoal"])
          }
        >
          {[
            "LOSE_FAT",
            "BUILD_MUSCLE",
            "IMPROVE_STRENGTH",
            "IMPROVE_ENDURANCE",
            "MAINTAIN_FITNESS",
            "GENERAL_FITNESS",
          ].map((value) => (
            <MenuItem key={value} value={value}>
              {value.replaceAll("_", " ")}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          fullWidth
          label="Experience"
          value={form.experienceLevel}
          onChange={(event) =>
            set(
              "experienceLevel",
              event.target.value as Profile["experienceLevel"],
            )
          }
        >
          {["BEGINNER", "INTERMEDIATE", "ADVANCED"].map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
        <TextField
          fullWidth
          type="number"
          label="Workouts per week"
          value={form.weeklyWorkoutTarget}
          onChange={(event) =>
            set("weeklyWorkoutTarget", Number(event.target.value))
          }
        />
        <TextField
          fullWidth
          type="number"
          label="Typical duration (minutes)"
          value={form.typicalWorkoutDuration ?? ""}
          onChange={(event) =>
            set(
              "typicalWorkoutDuration",
              event.target.value ? Number(event.target.value) : null,
            )
          }
        />
        <TextField
          select
          fullWidth
          label="Units"
          value={form.unitSystem}
          onChange={(event) =>
            set("unitSystem", event.target.value as Profile["unitSystem"])
          }
        >
          <MenuItem value="METRIC">Metric</MenuItem>
          <MenuItem value="IMPERIAL">Imperial</MenuItem>
        </TextField>
      </Stack>
      <Button
        type="submit"
        size="large"
        variant="contained"
        disabled={saving || dateOfBirthHasError}
      >
        {saving ? "Saving…" : submitLabel}
      </Button>
    </Stack>
  );
}
