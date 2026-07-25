import { ArrowDownward, ArrowUpward, FitnessCenter } from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import FitWellImage from "fitness/components/common/FitWellImage";
import { resolveExerciseImageCandidates } from "fitness/lib/images/assetRegistry";
import type { Exercise } from "fitness/utils/types";

export interface ExercisePrescription {
  sets: number;
  minimumReps: number;
  maximumReps: number;
  restSeconds: number;
}

export const defaultPrescription = (): ExercisePrescription => ({
  sets: 3,
  minimumReps: 8,
  maximumReps: 12,
  restSeconds: 90,
});

export default function WorkoutPlanExercisePrescription({
  exercises,
  prescriptions,
  onPrescriptionChange,
  onMove,
}: {
  exercises: Exercise[];
  prescriptions: Record<string, ExercisePrescription>;
  onPrescriptionChange: (
    exerciseId: string,
    value: ExercisePrescription,
  ) => void;
  onMove: (index: number, direction: -1 | 1) => void;
}) {
  return (
    <Paper variant="outlined" sx={{ overflow: "hidden" }}>
      <Box p={2}>
        <Typography variant="h6">Exercise prescription</Typography>
        <Typography variant="body2" color="text.secondary">
          Set the working sets, rep range, rest time, and exercise order.
        </Typography>
      </Box>
      <Divider />
      <Stack divider={<Divider flexItem />}>
        {exercises.map((exercise, index) => {
          const value = prescriptions[exercise.id] ?? defaultPrescription();
          const update = (
            field: keyof ExercisePrescription,
            fieldValue: string,
          ) =>
            onPrescriptionChange(exercise.id, {
              ...value,
              [field]: Number(fieldValue),
            });

          return (
            <Stack
              key={exercise.id}
              direction={{ xs: "column", md: "row" }}
              alignItems={{ md: "center" }}
              gap={2}
              p={2}
            >
              <Stack
                direction="row"
                alignItems="center"
                gap={1.5}
                minWidth={0}
                flex={1}
              >
                <Box
                  sx={{
                    width: 58,
                    height: 54,
                    borderRadius: 2,
                    overflow: "hidden",
                    flex: "0 0 auto",
                  }}
                >
                  <FitWellImage
                    candidates={resolveExerciseImageCandidates(exercise)}
                    alt={`${exercise.name} exercise illustration`}
                    height="100%"
                    objectFit="contain"
                  />
                </Box>
                <Box minWidth={0}>
                  <Typography fontWeight={700} noWrap>
                    {index + 1}. {exercise.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textTransform="capitalize"
                    noWrap
                  >
                    {exercise.primaryMuscle} ·{" "}
                    {exercise.equipment.toLowerCase()}
                  </Typography>
                </Box>
              </Stack>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(2, minmax(0, 1fr))",
                    sm: "repeat(4, minmax(90px, 1fr))",
                  },
                  gap: 1,
                  width: { xs: "100%", md: 480 },
                }}
              >
                <TextField
                  size="small"
                  type="number"
                  label="Sets"
                  value={value.sets}
                  inputProps={{ min: 1, max: 20 }}
                  onChange={(event) => update("sets", event.target.value)}
                />
                <TextField
                  size="small"
                  type="number"
                  label="Min reps"
                  value={value.minimumReps}
                  inputProps={{ min: 0, max: 10000 }}
                  onChange={(event) =>
                    update("minimumReps", event.target.value)
                  }
                />
                <TextField
                  size="small"
                  type="number"
                  label="Max reps"
                  value={value.maximumReps}
                  inputProps={{ min: 0, max: 10000 }}
                  onChange={(event) =>
                    update("maximumReps", event.target.value)
                  }
                />
                <TextField
                  size="small"
                  type="number"
                  label="Rest (sec)"
                  value={value.restSeconds}
                  inputProps={{ min: 0, max: 7200 }}
                  onChange={(event) =>
                    update("restSeconds", event.target.value)
                  }
                />
              </Box>

              <Stack direction="row" justifyContent="flex-end">
                <IconButton
                  aria-label={`Move ${exercise.name} up`}
                  disabled={index === 0}
                  onClick={() => onMove(index, -1)}
                >
                  <ArrowUpward />
                </IconButton>
                <IconButton
                  aria-label={`Move ${exercise.name} down`}
                  disabled={index === exercises.length - 1}
                  onClick={() => onMove(index, 1)}
                >
                  <ArrowDownward />
                </IconButton>
              </Stack>
            </Stack>
          );
        })}
      </Stack>
      {exercises.length === 0 && (
        <Stack alignItems="center" color="text.secondary" p={4}>
          <FitnessCenter sx={{ fontSize: 44, mb: 1 }} />
          <Typography>Select exercises to configure the plan.</Typography>
        </Stack>
      )}
    </Paper>
  );
}
