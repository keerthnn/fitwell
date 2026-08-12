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
import WorkoutPlanVisual from "fitness/components/workout-plans/WorkoutPlanVisual";
import { formatCount, formatDaysPerWeek } from "fitness/utils/copy";
import type { WorkoutPlan } from "fitness/utils/types";
import Link from "next/link";

export default function WorkoutPlanCard({ plan }: { plan: WorkoutPlan }) {
  return (
    <Card
      elevation={1}
      sx={{
        height: "100%",
        overflow: "hidden",
        position: "relative",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "0 16px 38px rgb(0 0 0 / 0.34)"
              : "0 16px 38px rgb(15 23 42 / 0.14)",
        },
      }}
    >
      <WorkoutPlanVisual plan={plan} />
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
            <CalendarMonth sx={{ fontSize: 18 }} />
            <Typography variant="caption">
              {formatDaysPerWeek(plan.daysPerWeek)}
            </Typography>
          </Stack>
          <Stack direction="row" gap={0.5} alignItems="center">
            <FitnessCenter sx={{ fontSize: 18 }} />
            <Typography variant="caption">
              {formatCount(plan.exercises.length, "exercise")}
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
