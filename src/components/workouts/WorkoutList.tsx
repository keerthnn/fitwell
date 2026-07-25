import { ArrowForward, Schedule } from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import FitWellImage from "fitness/components/common/FitWellImage";
import StatusChip from "fitness/components/common/StatusChip";
import DeleteWorkoutButton from "fitness/components/workouts/DeleteWorkoutButton";
import { resolveWorkoutImageCandidates } from "fitness/lib/images/assetRegistry";
import type { WorkoutListItem } from "fitness/utils/types";
import Link from "next/link";

const formatWorkoutDate = (date: string) =>
  new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));

function WorkoutListRow({
  workout,
  onDeleted,
}: {
  workout: WorkoutListItem;
  onDeleted?: (id: string) => void;
}) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) auto",
        alignItems: "center",
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      <Box
        component={Link}
        href={`/workouts/${workout.id}`}
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "60px minmax(0, 1fr) auto",
            sm: "92px minmax(0, 1fr) auto",
          },
          alignItems: "center",
          gap: { xs: 1, sm: 2 },
          px: { xs: 1.25, sm: 2 },
          py: 1.5,
          color: "inherit",
          textDecoration: "none",
        }}
      >
        <Box
          sx={{
            width: { xs: 60, sm: 92 },
            height: { xs: 56, sm: 76 },
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
          <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
            <Typography variant="h6" fontWeight={700} noWrap>
              {workout.name}
            </Typography>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <StatusChip status={workout.status} />
            </Box>
          </Stack>
          <Typography variant="body2" color="text.secondary" mt={0.25} noWrap>
            {formatWorkoutDate(workout.workoutDate)}
          </Typography>
          <Box sx={{ display: { xs: "block", sm: "none" }, mt: 0.75 }}>
            <StatusChip status={workout.status} />
          </Box>
        </Box>

        <Stack direction="row" alignItems="center" gap={{ xs: 0.5, sm: 2 }}>
          <Box sx={{ textAlign: "right" }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
              gap={0.5}
            >
              <Schedule sx={{ fontSize: 17 }} color="action" />
              <Typography variant="body2" whiteSpace="nowrap">
                {workout.durationMinutes
                  ? `${workout.durationMinutes} min`
                  : "—"}
              </Typography>
            </Stack>
            <Typography
              variant="caption"
              color="text.secondary"
              whiteSpace="nowrap"
            >
              {workout.exerciseCount} exercises
            </Typography>
          </Box>
          <IconButton
            component="span"
            aria-label={`View ${workout.name}`}
            sx={{ display: { xs: "none", sm: "inline-flex" } }}
          >
            <ArrowForward />
          </IconButton>
        </Stack>
      </Box>
      <Box pr={{ xs: 0.5, sm: 1.5 }}>
        <DeleteWorkoutButton
          compact
          workoutId={workout.id}
          workoutName={workout.name}
          onDeleted={() => onDeleted?.(workout.id)}
        />
      </Box>
    </Box>
  );
}

export default function WorkoutList({
  workouts,
  onDeleted,
}: {
  workouts: WorkoutListItem[];
  onDeleted?: (id: string) => void;
}) {
  return (
    <Paper variant="outlined" sx={{ overflow: "hidden" }}>
      <Stack divider={<Divider flexItem />}>
        {workouts.map((workout) => (
          <WorkoutListRow
            key={workout.id}
            workout={workout}
            onDeleted={onDeleted}
          />
        ))}
      </Stack>
    </Paper>
  );
}
