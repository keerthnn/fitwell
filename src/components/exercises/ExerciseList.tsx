import { PlayArrow } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import FitWellImage from "fitness/components/common/FitWellImage";
import { resolveExerciseImageCandidates } from "fitness/lib/images/assetRegistry";
import type { Exercise } from "fitness/utils/types";

function ExerciseListRow({
  exercise,
  onStart,
  isStarting,
  startDisabled,
}: {
  exercise: Exercise;
  onStart?: (exercise: Exercise) => void;
  isStarting: boolean;
  startDisabled: boolean;
}) {
  const exerciseType = exercise.isCompound ? "Compound" : "Isolation";

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "60px minmax(0, 1fr) auto",
          sm: "76px minmax(0, 1fr) auto",
        },
        alignItems: "center",
        gap: { xs: 1.25, sm: 2 },
        px: { xs: 1.25, sm: 2 },
        py: 1.25,
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      <Box
        sx={{
          width: { xs: 60, sm: 76 },
          height: { xs: 56, sm: 64 },
          overflow: "hidden",
          borderRadius: 2,
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
        <Typography variant="subtitle1" fontWeight={700} noWrap>
          {exercise.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {exercise.primaryMuscle}
          {exercise.secondaryMuscles.length > 0
            ? ` · ${exercise.secondaryMuscles.slice(0, 2).join(", ")}`
            : ""}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          textTransform="capitalize"
          display="block"
          noWrap
        >
          {exercise.equipment.toLowerCase()} · {exercise.movement.toLowerCase()}{" "}
          · {exerciseType}
        </Typography>
      </Box>

      {onStart && (
        <Button
          size="small"
          variant="outlined"
          startIcon={
            isStarting ? <CircularProgress size={16} /> : <PlayArrow />
          }
          disabled={startDisabled}
          onClick={() => onStart(exercise)}
          aria-label={`Start a workout with ${exercise.name}`}
          sx={{
            minWidth: { xs: 72, sm: 82 },
            px: { xs: 1.25, sm: 2 },
            "& .MuiButton-startIcon": {
              mr: 0.75,
            },
          }}
        >
          Start
        </Button>
      )}
    </Box>
  );
}

export default function ExerciseList({
  exercises,
  onStart,
  startingExerciseId,
}: {
  exercises: Exercise[];
  onStart?: (exercise: Exercise) => void;
  startingExerciseId?: string;
}) {
  const splitAt = Math.ceil(exercises.length / 2);
  const columns = [
    exercises.slice(0, splitAt),
    exercises.slice(splitAt),
  ].filter((column) => column.length > 0);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
        alignItems: "start",
        gap: 2,
      }}
    >
      {columns.map((column, columnIndex) => (
        <Paper
          key={columnIndex === 0 ? "left" : "right"}
          variant="outlined"
          sx={{ overflow: "hidden" }}
        >
          <Stack divider={<Divider flexItem />}>
            {column.map((exercise) => (
              <ExerciseListRow
                key={exercise.id}
                exercise={exercise}
                onStart={onStart}
                isStarting={startingExerciseId === exercise.id}
                startDisabled={Boolean(startingExerciseId)}
              />
            ))}
          </Stack>
        </Paper>
      ))}
    </Box>
  );
}
