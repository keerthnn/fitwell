import { Add, CheckCircle, Delete } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { saveWorkoutExerciseSets } from "fitness/utils/spec";
import type { WorkoutExerciseDetail, WorkoutSet } from "fitness/utils/types";
import { formatCount } from "fitness/utils/copy";
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
  const [sets, setSets] = useState<WorkoutSet[]>(
    item.sets.length ? item.sets : [emptySet(1)],
  );
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const tracking = item.exercise.trackingType;
  const update = (index: number, value: Partial<WorkoutSet>) => {
    setSaveState("idle");
    setSets((current) =>
      current.map((set, setIndex) =>
        setIndex === index ? { ...set, ...value } : set,
      ),
    );
  };
  const number = (value: string) => (value === "" ? null : Number(value));
  const usesReps = ["REPS_WEIGHT", "REPS_ONLY"].includes(tracking);
  const usesWeight = tracking === "REPS_WEIGHT";
  const usesDuration = ["DURATION", "DURATION_DISTANCE"].includes(tracking);
  const usesDistance = ["DISTANCE", "DURATION_DISTANCE"].includes(tracking);

  async function save() {
    setSaveState("saving");
    try {
      await saveWorkoutExerciseSets(
        item.id,
        sets.map((set, index) => ({ ...set, setNumber: index + 1 })),
      );
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        gap={0.75}
        mb={2.5}
      >
        <Box>
          <Typography variant="h6">{item.exercise.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {item.exercise.primaryMuscle} · {item.exercise.equipment.toLowerCase()}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {formatCount(sets.length, "set")}
        </Typography>
      </Stack>

      <Stack gap={1.5}>
        {sets.map((set, index) => (
          <Box
            key={set.id ?? index}
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr auto",
                sm: "72px minmax(0, 1fr) auto",
              },
              alignItems: "center",
              gap: { xs: 1.25, sm: 1.5 },
              minHeight: 72,
              p: { xs: 1.25, sm: 1.5 },
              borderRadius: 2.5,
              bgcolor: "action.hover",
              border: (theme) => `1px solid ${theme.fitwell.colors.border}`,
            }}
          >
            <Typography fontWeight={800}>Set {index + 1}</Typography>

            <Box
              sx={{
                gridColumn: { xs: "1 / -1", sm: "auto" },
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, minmax(0, 1fr))",
                  md: `repeat(${[
                    usesReps,
                    usesWeight,
                    usesDuration,
                    usesDistance,
                  ].filter(Boolean).length}, minmax(112px, 1fr))`,
                },
                gap: 1.25,
                "& .MuiInputBase-root": { minHeight: 44 },
              }}
            >
              {usesReps && (
                <SetNumber
                  label="Reps"
                  value={set.reps}
                  onChange={(value) => update(index, { reps: value })}
                  parse={number}
                />
              )}
              {usesWeight && (
                <SetNumber
                  label="Weight"
                  unit="kg"
                  value={set.weightKg}
                  onChange={(value) => update(index, { weightKg: value })}
                  parse={number}
                />
              )}
              {usesDuration && (
                <SetNumber
                  label="Duration"
                  unit="sec"
                  value={set.durationSeconds}
                  onChange={(value) => update(index, { durationSeconds: value })}
                  parse={number}
                />
              )}
              {usesDistance && (
                <SetNumber
                  label="Distance"
                  unit="m"
                  value={set.distanceMeters}
                  onChange={(value) => update(index, { distanceMeters: value })}
                  parse={number}
                />
              )}
            </Box>

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
              gap={0.5}
              sx={{ gridColumn: { xs: "2", sm: "auto" }, gridRow: { xs: 1 } }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={set.isCompleted}
                    onChange={(event) =>
                      update(index, { isCompleted: event.target.checked })
                    }
                    inputProps={{
                      "aria-label": `Complete set ${index + 1}`,
                    }}
                  />
                }
                label="Done"
                sx={{ mr: 0, "& .MuiFormControlLabel-label": { fontSize: 14 } }}
              />
              <IconButton
                color="error"
                aria-label={`Remove set ${index + 1}`}
                onClick={() => {
                  setSaveState("idle");
                  setSets((current) =>
                    current
                      .filter((_, setIndex) => setIndex !== index)
                      .map((value, setIndex) => ({
                        ...value,
                        setNumber: setIndex + 1,
                      })),
                  );
                }}
              >
                <Delete />
              </IconButton>
            </Stack>
          </Box>
        ))}

        {saveState === "error" && (
          <Alert severity="error">
            These sets could not be saved. Your entries are still here—try again.
          </Alert>
        )}

        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ sm: "center" }}
          gap={1}
          pt={0.5}
        >
          <Button
            startIcon={<Add />}
            onClick={() => {
              setSaveState("idle");
              setSets((current) => [
                ...current,
                emptySet(current.length + 1),
              ]);
            }}
          >
            Add set
          </Button>
          <Button
            variant="contained"
            disabled={!sets.length || saveState === "saving"}
            onClick={() => void save()}
          >
            {saveState === "saving" ? "Saving…" : "Save sets"}
          </Button>
          {saveState === "saved" && (
            <Stack
              direction="row"
              gap={0.75}
              alignItems="center"
              color="success.main"
              ml={{ sm: 1 }}
            >
              <CheckCircle fontSize="small" />
              <Typography variant="body2" fontWeight={700}>
                Sets saved
              </Typography>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}

function SetNumber({
  label,
  unit,
  value,
  onChange,
  parse,
}: {
  label: string;
  unit?: string;
  value: number | null | undefined;
  onChange: (value: number | null) => void;
  parse: (value: string) => number | null;
}) {
  return (
    <TextField
      size="small"
      type="number"
      label={unit ? `${label} (${unit})` : label}
      value={value ?? ""}
      onChange={(event) => onChange(parse(event.target.value))}
      inputProps={{ min: 0 }}
    />
  );
}
