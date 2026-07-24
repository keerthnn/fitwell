import { FitnessCenter, PlayArrow, Schedule } from "@mui/icons-material";
import { Box, Button, Card, Stack, Typography } from "@mui/material";
import FitWellImage from "fitness/components/common/FitWellImage";
import {
  isApprovedLocalImagePath,
  resolveWorkoutImageCandidates,
} from "fitness/lib/images/assetRegistry";
import type { WorkoutListItem } from "fitness/utils/types";
import Link from "next/link";

export default function ActiveWorkoutBanner({
  workout,
}: {
  workout: WorkoutListItem;
}) {
  const bannerCandidates = [
    ...(isApprovedLocalImagePath(workout.sourcePlanCoverImagePath)
      ? [
          {
            src: workout.sourcePlanCoverImagePath!,
            kind: "specific" as const,
          },
        ]
      : []),
    {
      src: "/images/workouts/strength-768.webp",
      srcSet:
        "/images/workouts/strength-384.webp 384w, /images/workouts/strength-768.webp 768w",
      kind: "fallback" as const,
    },
    ...resolveWorkoutImageCandidates(workout),
  ];

  return (
    <Card
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
          sx={{ color: "success.main", letterSpacing: 0.8 }}
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
            <Schedule fontSize="small" />
            <Typography variant="body2">
              {workout.durationMinutes
                ? `${workout.durationMinutes} min`
                : "Live session"}
            </Typography>
          </Stack>
          <Stack direction="row" gap={0.75} alignItems="center">
            <FitnessCenter fontSize="small" />
            <Typography variant="body2">
              {workout.exerciseCount} exercises
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
        <FitWellImage
          candidates={bannerCandidates}
          alt={`${workout.name} workout illustration`}
          height="100%"
          objectFit="contain"
        />
      </Box>

      <Button
        component={Link}
        href={`/workouts/live/${workout.id}`}
        variant="contained"
        color="success"
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
    </Card>
  );
}
