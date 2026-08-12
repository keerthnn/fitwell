import {
  Add,
  Circle,
  CircleCheckFilled,
  Delete,
  Stopwatch,
} from "fitness/components/common/icons";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  DEFAULT_EXERCISE_REST_SECONDS,
  MAX_EXERCISE_REST_SECONDS,
  resolveExerciseRestSeconds,
  stampExerciseRestSeconds,
} from "fitness/components/workouts/exerciseRest";
import { formatCount } from "fitness/utils/copy";
import { saveWorkoutExerciseSets } from "fitness/utils/spec";
import type { WorkoutExerciseDetail, WorkoutSet } from "fitness/utils/types";
import { useState } from "react";

const emptySet = (setNumber: number): WorkoutSet => ({
  setNumber,
  reps: null,
  weightKg: null,
  durationSeconds: null,
  distanceMeters: null,
  restSeconds: DEFAULT_EXERCISE_REST_SECONDS,
  isCompleted: false,
});

function repsError(value: number | null | undefined) {
  if (value == null) return "Reps are required";
  if (!Number.isInteger(value) || value < 1 || value > 10000) {
    return "Enter a whole number from 1 to 10,000";
  }
  return undefined;
}

function metricError(
  value: number | null | undefined,
  label: string,
  maximum: number,
  integer = false,
) {
  if (value == null) return `${label} is required`;
  if (
    !Number.isFinite(value) ||
    value < 0 ||
    value > maximum ||
    (integer && !Number.isInteger(value))
  ) {
    return `Enter ${label.toLowerCase()} from 0 to ${maximum.toLocaleString()}`;
  }
  return undefined;
}

export interface SetEditorProps {
  item: WorkoutExerciseDetail;
  disabled?: boolean;
  onStartRest?: (seconds: number) => void;
}

export default function SetEditor({
  item,
  disabled = false,
  onStartRest,
}: SetEditorProps) {
  const [sets, setSets] = useState<WorkoutSet[]>(
    item.sets.length ? item.sets : [emptySet(1)],
  );
  const [restSeconds, setRestSeconds] = useState<number | "">(() =>
    resolveExerciseRestSeconds(item.sets),
  );
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [validationAttempted, setValidationAttempted] = useState(false);
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
  const effectiveRestSeconds =
    restSeconds === "" ? DEFAULT_EXERCISE_REST_SECONDS : restSeconds;
  const isLiveTimerEnabled = onStartRest !== undefined;
  const getSetErrors = (set: WorkoutSet) => ({
    reps: usesReps ? repsError(set.reps) : undefined,
    weight: usesWeight
      ? metricError(set.weightKg, "Weight", 2000)
      : undefined,
    duration: usesDuration
      ? metricError(set.durationSeconds, "Duration", 86400, true)
      : undefined,
    distance: usesDistance
      ? metricError(set.distanceMeters, "Distance", 1000000)
      : undefined,
  });
  const hasInvalidRequiredValues = sets.some(
    (set) =>
      Object.values(getSetErrors(set)).some((message) => message !== undefined),
  );

  async function save() {
    if (hasInvalidRequiredValues) {
      setValidationAttempted(true);
      return;
    }

    setValidationAttempted(false);
    setSaveState("saving");
    try {
      const setsToSave = isLiveTimerEnabled
        ? stampExerciseRestSeconds(sets, effectiveRestSeconds)
        : sets;
      await saveWorkoutExerciseSets(
        item.id,
        setsToSave.map((set, index) => ({
          ...set,
          setNumber: index + 1,
        })),
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
        <Stack
          direction="row"
          alignItems="center"
          flexWrap="wrap"
          gap={1}
        >
          {isLiveTimerEnabled && (
            <>
              <TextField
                size="small"
                type="number"
                label="Rest (sec)"
                value={restSeconds}
                disabled={disabled}
                inputProps={{
                  min: 0,
                  max: MAX_EXERCISE_REST_SECONDS,
                  step: 1,
                }}
                onBlur={() => {
                  if (restSeconds === "") {
                    setRestSeconds(DEFAULT_EXERCISE_REST_SECONDS);
                  }
                }}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  if (nextValue === "") {
                    setRestSeconds("");
                    setSaveState("idle");
                    return;
                  }

                  const parsed = Number(nextValue);
                  if (
                    Number.isInteger(parsed) &&
                    parsed >= 0 &&
                    parsed <= MAX_EXERCISE_REST_SECONDS
                  ) {
                    setRestSeconds(parsed);
                    setSaveState("idle");
                  }
                }}
                sx={{ width: 128, "& .MuiInputBase-root": { minHeight: 44 } }}
              />
              <Button
                variant="outlined"
                disabled={disabled || effectiveRestSeconds === 0}
                onClick={() => onStartRest?.(effectiveRestSeconds)}
                startIcon={<Stopwatch />}
                sx={{ minHeight: 44 }}
              >
                Start rest
              </Button>
            </>
          )}
          <Typography variant="body2" color="text.secondary">
            {formatCount(sets.length, "set")}
          </Typography>
        </Stack>
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
                  disabled={disabled}
                  required
                  min={1}
                  max={10000}
                  step={1}
                  error={validationAttempted && Boolean(repsError(set.reps))}
                  helperText={validationAttempted ? repsError(set.reps) : undefined}
                  onChange={(value) => update(index, { reps: value })}
                  parse={number}
                />
              )}
              {usesWeight && (
                <SetNumber
                  label="Weight"
                  unit="kg"
                  value={set.weightKg}
                  disabled={disabled}
                  required
                  min={0}
                  max={2000}
                  helperText={
                    validationAttempted
                      ? metricError(set.weightKg, "Weight", 2000)
                      : undefined
                  }
                  error={
                    validationAttempted &&
                    Boolean(metricError(set.weightKg, "Weight", 2000))
                  }
                  onChange={(value) => update(index, { weightKg: value })}
                  parse={number}
                />
              )}
              {usesDuration && (
                <SetNumber
                  label="Duration"
                  unit="sec"
                  value={set.durationSeconds}
                  disabled={disabled}
                  required
                  min={0}
                  max={86400}
                  step={1}
                  error={
                    validationAttempted &&
                    Boolean(
                      metricError(set.durationSeconds, "Duration", 86400, true),
                    )
                  }
                  helperText={
                    validationAttempted
                      ? metricError(
                          set.durationSeconds,
                          "Duration",
                          86400,
                          true,
                        )
                      : undefined
                  }
                  onChange={(value) => update(index, { durationSeconds: value })}
                  parse={number}
                />
              )}
              {usesDistance && (
                <SetNumber
                  label="Distance"
                  unit="m"
                  value={set.distanceMeters}
                  disabled={disabled}
                  required
                  min={0}
                  max={1000000}
                  error={
                    validationAttempted &&
                    Boolean(
                      metricError(set.distanceMeters, "Distance", 1000000),
                    )
                  }
                  helperText={
                    validationAttempted
                      ? metricError(set.distanceMeters, "Distance", 1000000)
                      : undefined
                  }
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
              <Checkbox
                checked={set.isCompleted}
                disabled={disabled}
                icon={<Circle />}
                checkedIcon={<CircleCheckFilled />}
                onChange={(event) => {
                  const isCompleted = event.target.checked;
                  const setHasInvalidRequiredValues = Object.values(
                    getSetErrors(set),
                  ).some((message) => message !== undefined);

                  if (isCompleted && setHasInvalidRequiredValues) {
                    setValidationAttempted(true);
                    return;
                  }

                  update(index, { isCompleted });
                  if (isCompleted && !set.isCompleted) {
                    onStartRest?.(effectiveRestSeconds);
                  }
                }}
                inputProps={{
                  "aria-label": `Complete set ${index + 1}`,
                }}
                sx={{
                  color: "text.disabled",
                  "&.Mui-checked": { color: "success.main" },
                }}
              />
              <IconButton
                aria-label={`Remove set ${index + 1}`}
                disabled={disabled}
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
                sx={{
                  color: "text.disabled",
                  "&:hover, &:focus-visible": {
                    color: "error.main",
                    bgcolor: (theme) =>
                      theme.fitwell.colors.semantic.error.container,
                  },
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

        {validationAttempted && hasInvalidRequiredValues && (
          <Alert severity="error">
            Enter every required value for each set before saving.
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
            disabled={disabled}
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
            disabled={disabled || !sets.length || saveState === "saving"}
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
              <CircleCheckFilled fontSize="small" />
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
  disabled,
  required,
  error,
  helperText,
  min,
  max,
  step,
  onChange,
  parse,
}: {
  label: string;
  unit?: string;
  value: number | null | undefined;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number | null) => void;
  parse: (value: string) => number | null;
}) {
  return (
    <TextField
      size="small"
      type="number"
      label={unit ? `${label} (${unit})` : label}
      value={value ?? ""}
      disabled={disabled}
      required={required}
      error={error}
      helperText={helperText}
      onChange={(event) => onChange(parse(event.target.value))}
      inputProps={{ min, max, step }}
    />
  );
}
