import { ArrowForward, Schedule } from "@mui/icons-material";
import { Box, Button, Divider, Paper, Stack, Typography } from "@mui/material";
import FitWellImage from "fitness/components/common/FitWellImage";
import {
  resolveExerciseImageCandidates,
  resolveWorkoutImageCandidates,
} from "fitness/lib/images/assetRegistry";
import type { DashboardSummary, WorkoutListItem } from "fitness/utils/types";
import Link from "next/link";

const formatWorkoutDate = (date: string) =>
  new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));

function PanelHeader({ title, href }: { title: string; href: string }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      mb={1}
    >
      <Typography variant="h6" component="h2" fontWeight={800}>
        {title}
      </Typography>
      <Button component={Link} href={href} size="small">
        View all
      </Button>
    </Stack>
  );
}

function RecentWorkoutRow({ workout }: { workout: WorkoutListItem }) {
  return (
    <Box
      component={Link}
      href={`/workouts/${workout.id}`}
      sx={{
        display: "grid",
        gridTemplateColumns: "76px minmax(0, 1fr) auto",
        alignItems: "center",
        gap: 1.5,
        py: 1.25,
        borderRadius: 2,
        color: "inherit",
        textDecoration: "none",
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      <Box
        sx={{
          width: 76,
          height: 64,
          overflow: "hidden",
          borderRadius: 2,
        }}
      >
        <FitWellImage
          candidates={resolveWorkoutImageCandidates(workout)}
          alt={`${workout.name} workout illustration`}
          height="100%"
          objectFit="contain"
        />
      </Box>
      <Box minWidth={0}>
        <Typography fontWeight={700} noWrap>
          {workout.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {formatWorkoutDate(workout.workoutDate)}
        </Typography>
      </Box>
      <Stack alignItems="flex-end" gap={0.5}>
        <Stack direction="row" alignItems="center" gap={0.5}>
          <Schedule sx={{ fontSize: 16 }} color="action" />
          <Typography variant="body2" whiteSpace="nowrap">
            {workout.durationMinutes ? `${workout.durationMinutes} min` : "—"}
          </Typography>
        </Stack>
        <Typography
          variant="caption"
          color="text.secondary"
          whiteSpace="nowrap"
        >
          {workout.exerciseCount} exercises
        </Typography>
      </Stack>
    </Box>
  );
}

export function RecentWorkoutsPanel({
  workouts,
}: {
  workouts: WorkoutListItem[];
}) {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5 }, height: "100%" }}>
      <PanelHeader title="Recent workouts" href="/workouts" />
      <Divider />
      {workouts.length ? (
        workouts.slice(0, 3).map((workout, index) => (
          <Box key={workout.id}>
            <RecentWorkoutRow workout={workout} />
            {index < Math.min(workouts.length, 3) - 1 && <Divider />}
          </Box>
        ))
      ) : (
        <Typography color="text.secondary" py={4} textAlign="center">
          Your completed workouts will appear here.
        </Typography>
      )}
      {workouts.length > 0 && (
        <Button
          component={Link}
          href="/workouts"
          endIcon={<ArrowForward />}
          sx={{ display: "flex", mx: "auto", mt: 1 }}
        >
          View all workouts
        </Button>
      )}
    </Paper>
  );
}

export function FrequentExercisesPanel({
  exercises,
}: {
  exercises: DashboardSummary["frequentExercises"];
}) {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5 }, height: "100%" }}>
      <PanelHeader title="Frequently used exercises" href="/exercises" />
      <Divider />
      {exercises.length ? (
        exercises.slice(0, 4).map(({ exercise, count }, index) => (
          <Box key={exercise.name}>
            <Box
              component={Link}
              href="/exercises"
              sx={{
                display: "grid",
                gridTemplateColumns: "64px minmax(0, 1fr)",
                alignItems: "center",
                gap: 1.5,
                py: 1,
                borderRadius: 2,
                color: "inherit",
                textDecoration: "none",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 56,
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
                <Typography fontWeight={700} noWrap>
                  {exercise.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Used in {count} {count === 1 ? "workout" : "workouts"}
                </Typography>
              </Box>
            </Box>
            {index < Math.min(exercises.length, 4) - 1 && <Divider />}
          </Box>
        ))
      ) : (
        <Typography color="text.secondary" py={4} textAlign="center">
          Exercise insights appear after completed workouts.
        </Typography>
      )}
    </Paper>
  );
}
