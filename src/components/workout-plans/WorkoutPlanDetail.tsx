import {
  CalendarMonth,
  ContentCopy,
  FitnessCenter,
  PlayArrow,
  Schedule,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import FitWellImage from "fitness/components/common/FitWellImage";
import HeroSurface from "fitness/components/common/HeroSurface";
import { resolveExerciseImageCandidates } from "fitness/lib/images/assetRegistry";
import WorkoutPlanVisual from "fitness/components/workout-plans/WorkoutPlanVisual";
import { formatCount, pluralize } from "fitness/utils/copy";
import type { WorkoutPlan, WorkoutPlanExercise } from "fitness/utils/types";

function repLabel(item: WorkoutPlanExercise) {
  if (
    item.minimumReps &&
    item.maximumReps &&
    item.minimumReps !== item.maximumReps
  ) {
    return `${item.minimumReps}–${item.maximumReps} reps`;
  }
  const reps = item.minimumReps ?? item.maximumReps;
  return reps ? `${reps} reps` : null;
}

function ExerciseRow({
  item,
  position,
}: {
  item: WorkoutPlanExercise;
  position: number;
}) {
  const exercise = item.exercise;
  const repetitions = repLabel(item);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "28px 60px minmax(0, 1fr)",
          sm: "32px 76px minmax(0, 1fr) auto",
        },
        alignItems: "center",
        gap: { xs: 1, sm: 1.5 },
        py: 1.5,
      }}
    >
      <Box
        sx={{
          width: { xs: 26, sm: 30 },
          height: { xs: 26, sm: 30 },
          borderRadius: "50%",
          bgcolor: "action.selected",
          color: (theme) => theme.fitwell.colors.interaction.onPrimaryContainer,
          display: "grid",
          placeItems: "center",
          fontWeight: 800,
          fontSize: "0.8rem",
        }}
      >
        {position}
      </Box>

      <Box
        sx={{
          width: { xs: 60, sm: 76 },
          height: { xs: 56, sm: 68 },
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        {exercise ? (
          <FitWellImage
            candidates={resolveExerciseImageCandidates(exercise)}
            alt={`${exercise.name} exercise illustration`}
            height="100%"
            objectFit="contain"
          />
        ) : (
          <Box
            role="img"
            aria-label="Exercise muscle group not mapped"
            sx={{
              width: "100%",
              height: "100%",
              bgcolor: "action.hover",
            }}
          />
        )}
      </Box>

      <Box minWidth={0}>
        <Typography variant="subtitle1" fontWeight={700} noWrap>
          {exercise?.name ?? "Exercise"}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {exercise?.primaryMuscle ?? "Movement"}
          {exercise ? ` · ${exercise.equipment.toLowerCase()}` : ""}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: { xs: "block", sm: "none" } }}
          noWrap
        >
          {formatCount(item.sets, "set")}
          {repetitions ? ` · ${repetitions}` : ""}
          {item.restSeconds ? ` · ${item.restSeconds}s rest` : ""}
        </Typography>
      </Box>

      <Stack
        direction="row"
        alignItems="center"
        gap={2}
        sx={{ display: { xs: "none", sm: "flex" } }}
      >
        <Box textAlign="right">
          <Typography variant="body2" fontWeight={700} whiteSpace="nowrap">
            {formatCount(item.sets, "set")}{repetitions ? ` · ${repetitions}` : ""}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {item.restSeconds ? `${item.restSeconds}s rest` : "Self-paced"}
          </Typography>
        </Box>
        <FitnessCenter sx={{ color: "text.secondary", fontSize: 20 }} />
      </Stack>
    </Box>
  );
}

export default function WorkoutPlanDetail({
  plan,
  error,
  isStarting,
  isDuplicating,
  onStart,
  onDuplicate,
}: {
  plan: WorkoutPlan;
  error?: string;
  isStarting: boolean;
  isDuplicating: boolean;
  onStart: () => void;
  onDuplicate: () => void;
}) {
  return (
    <Stack gap={3}>
      {error && <Alert severity="error">{error}</Alert>}

      <HeroSurface sx={{ overflow: "hidden" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "minmax(280px, 38%) 1fr" },
          }}
        >
          <Box sx={{ bgcolor: "action.hover", alignSelf: "stretch" }}>
            <WorkoutPlanVisual plan={plan} aspectRatio="16 / 10" />
          </Box>

          <Stack p={{ xs: 2.5, sm: 4 }} gap={2.5} justifyContent="center">
            <Stack direction="row" gap={1} flexWrap="wrap">
              <Typography
                variant="body2"
                color="text.secondary"
                textTransform="capitalize"
                alignSelf="center"
              >
                {plan.difficulty.toLowerCase()} · {plan.category}
              </Typography>
              {plan.isBuiltIn && <Chip size="small" label="Built-in plan" />}
            </Stack>

            <Typography color="text.secondary">
              {plan.description ||
                "A structured programme to guide your next training block."}
            </Typography>

            <Stack direction="row" gap={{ xs: 2, sm: 4 }} flexWrap="wrap">
              <Stack direction="row" alignItems="center" gap={0.75}>
                <CalendarMonth sx={{ color: "text.secondary", fontSize: 18 }} />
                <Box>
                  <Typography fontWeight={800}>{plan.daysPerWeek}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {pluralize(plan.daysPerWeek, "day", "days")}/week
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" alignItems="center" gap={0.75}>
                <FitnessCenter sx={{ color: "text.secondary", fontSize: 18 }} />
                <Box>
                  <Typography fontWeight={800}>
                    {plan.exercises.length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {pluralize(plan.exercises.length, "exercise")}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" alignItems="center" gap={0.75}>
                <Schedule sx={{ color: "text.secondary", fontSize: 18 }} />
                <Box>
                  <Typography fontWeight={800}>
                    {plan.exercises.reduce(
                      (total, item) => total + item.sets,
                      0,
                    )}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    total {pluralize(
                      plan.exercises.reduce((total, item) => total + item.sets, 0),
                      "set",
                    )}
                  </Typography>
                </Box>
              </Stack>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} gap={1.5}>
              <Button
                variant="contained"
                startIcon={<PlayArrow />}
                disabled={isStarting || isDuplicating}
                onClick={onStart}
              >
                {isStarting ? "Starting…" : "Start workout"}
              </Button>
              <Button
                variant="outlined"
                startIcon={<ContentCopy />}
                disabled={isStarting || isDuplicating}
                onClick={onDuplicate}
              >
                {isDuplicating ? "Duplicating…" : "Duplicate plan"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </HeroSurface>

      <Paper variant="outlined" sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
        <Typography variant="h5" mb={0.5}>
          Workout exercises
        </Typography>
        <Typography color="text.secondary" variant="body2" mb={1}>
          Complete the movements in this order.
        </Typography>
        <Stack divider={<Divider flexItem />}>
          {plan.exercises.map((item, index) => (
            <ExerciseRow
              key={item.id ?? `${item.exerciseId}-${item.order}`}
              item={item}
              position={index + 1}
            />
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
}
