import { ArrowForward, Schedule } from "@mui/icons-material";
import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import FitWellImage from "fitness/components/common/FitWellImage";
import StatusChip from "fitness/components/common/StatusChip";
import { resolveWorkoutImageCandidates } from "fitness/lib/images/assetRegistry";
import type { WorkoutListItem } from "fitness/utils/types";
import Link from "next/link";

export default function WorkoutCard({
  workout,
  compact = false,
}: {
  workout: WorkoutListItem;
  compact?: boolean;
}) {
  return (
    <Card
      variant="outlined"
      sx={{
        display: compact ? { sm: "grid" } : "block",
        gridTemplateColumns: compact ? "180px 1fr" : undefined,
        overflow: "hidden",
        height: "100%",
      }}
    >
      <FitWellImage
        candidates={resolveWorkoutImageCandidates(workout)}
        alt={`${workout.name} workout illustration`}
        aspectRatio={compact ? "4 / 3" : "16 / 10"}
        objectFit="contain"
      />
      <CardContent>
        <Stack direction="row" justifyContent="space-between" gap={2}>
          <Typography variant="h6">{workout.name}</Typography>
          <StatusChip status={workout.status} />
        </Stack>
        <Typography color="text.secondary" variant="body2" mt={0.75}>
          {new Date(workout.workoutDate).toLocaleDateString()} ·{" "}
          {workout.exerciseCount} exercises
        </Typography>
        <Stack direction="row" alignItems="center" gap={0.5} mt={1}>
          <Schedule fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {workout.durationMinutes
              ? `${workout.durationMinutes} min`
              : "Duration not recorded"}
          </Typography>
        </Stack>
        <Button
          component={Link}
          href={`/workouts/${workout.id}`}
          endIcon={<ArrowForward />}
          sx={{ mt: 1.5 }}
        >
          View workout
        </Button>
      </CardContent>
    </Card>
  );
}
