import {
  ArrowForward,
  CalendarMonth,
  FitnessCenter,
} from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import FitWellImage from "fitness/components/common/FitWellImage";
import { resolveWorkoutPlanImageCandidates } from "fitness/lib/images/assetRegistry";
import type { WorkoutPlan } from "fitness/utils/types";
import Link from "next/link";

export default function WorkoutPlanCard({ plan }: { plan: WorkoutPlan }) {
  return (
    <Card
      variant="outlined"
      sx={{ height: "100%", overflow: "hidden", position: "relative" }}
    >
      <FitWellImage
        candidates={resolveWorkoutPlanImageCandidates(plan)}
        alt={`${plan.name} Workout Plan cover`}
        aspectRatio="3 / 2"
        objectFit="contain"
      />
      <CardContent>
        <Stack direction="row" justifyContent="space-between" gap={1}>
          <Typography variant="h6">{plan.name}</Typography>
          {plan.isBuiltIn && <Chip size="small" label="Built-in" />}
        </Stack>
        <Typography color="text.secondary" variant="body2" mt={0.75}>
          {plan.description}
        </Typography>
        <Stack direction="row" gap={2} mt={2} color="text.secondary">
          <Stack direction="row" gap={0.5} alignItems="center">
            <CalendarMonth fontSize="small" />
            <Typography variant="caption">
              {plan.daysPerWeek} days/week
            </Typography>
          </Stack>
          <Stack direction="row" gap={0.5} alignItems="center">
            <FitnessCenter fontSize="small" />
            <Typography variant="caption">
              {plan.exercises.length} exercises
            </Typography>
          </Stack>
        </Stack>
        <Button
          component={Link}
          href={`/workout-plans/${plan.id}`}
          endIcon={<ArrowForward />}
          sx={{ mt: 2 }}
        >
          View plan
        </Button>
      </CardContent>
    </Card>
  );
}
