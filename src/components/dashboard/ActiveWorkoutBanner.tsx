import { FitnessCenter, PlayArrow, Schedule } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import HeroSurface from "fitness/components/common/HeroSurface";
import WorkoutSummaryVisual from "fitness/components/workouts/WorkoutSummaryVisual";
import { formatCount } from "fitness/utils/copy";
import type { WorkoutListItem } from "fitness/utils/types";
import Link from "next/link";

export default function ActiveWorkoutBanner({
  workout,
}: {
  workout: WorkoutListItem;
}) {
  return (
    <HeroSurface
      tone="warning"
      sx={{
        position: "relative",
        minHeight: { xs: 230, sm: 190 },
        mb: 3,
        overflow: "hidden",
        bgcolor: (theme) => theme.fitwell.colors.sidebar.start,
        color: "common.white",
        border: 0,
      }}
    >
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          width: { xs: "64%", sm: "44%" },
          p: { xs: 2.5, sm: 3 },
        }}
      >
        <Typography
          variant="overline"
          fontWeight={800}
          sx={{ color: "warning.light", letterSpacing: 0.8 }}
        >
          Workout in progress
        </Typography>
        <Typography variant="h5" fontWeight={800} mt={0.25}>
          {workout.name}
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          gap={{ xs: 0.75, sm: 2 }}
          mt={2}
        >
          <Stack direction="row" gap={0.75} alignItems="center">
            <Schedule sx={{ fontSize: 18 }} />
            <Typography variant="body2">
              {workout.durationMinutes
                ? `${workout.durationMinutes} min`
                : "Live session"}
            </Typography>
          </Stack>
          <Stack direction="row" gap={0.75} alignItems="center">
            <FitnessCenter sx={{ fontSize: 18 }} />
            <Typography variant="body2">
              {formatCount(workout.exerciseCount, "exercise")}
            </Typography>
          </Stack>
        </Stack>
      </Box>

      <Box
        sx={{
          position: "absolute",
          zIndex: 1,
          right: { xs: -18, sm: "17%" },
          bottom: 0,
          width: { xs: "58%", sm: "43%" },
          height: "100%",
          "& img": {
            bgcolor: "transparent",
            objectPosition: "center bottom",
          },
        }}
      >
        <WorkoutSummaryVisual workout={workout} height="100%" />
      </Box>

      <Button
        component={Link}
        href={`/workouts/live/${workout.id}`}
        variant="contained"
        size="large"
        startIcon={<PlayArrow />}
        sx={{
          position: "absolute",
          zIndex: 3,
          right: { xs: 16, sm: 24 },
          bottom: { xs: 16, sm: "auto" },
          top: { sm: "50%" },
          transform: { sm: "translateY(-50%)" },
          minWidth: { sm: 166 },
        }}
      >
        Continue
      </Button>
    </HeroSurface>
  );
}
