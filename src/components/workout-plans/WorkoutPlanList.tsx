import {
  ArrowForward,
  Barbell,
  CalendarMonth,
} from "fitness/components/common/icons";
import {
  Box,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import WorkoutPlanVisual from "fitness/components/workout-plans/WorkoutPlanVisual";
import { formatCount, formatDaysPerWeek } from "fitness/utils/copy";
import type { WorkoutPlan } from "fitness/utils/types";
import Link from "next/link";

function WorkoutPlanListRow({ plan }: { plan: WorkoutPlan }) {
  return (
    <Box
      component={Link}
      href={`/workout-plans/${plan.id}`}
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "64px minmax(0, 1fr)",
          sm: "92px minmax(0, 1fr) auto",
        },
        alignItems: "center",
        gap: { xs: 1.25, sm: 2 },
        px: { xs: 1.25, sm: 2 },
        py: 1.25,
        color: "inherit",
        textDecoration: "none",
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      <Box
        sx={{
          width: { xs: 64, sm: 92 },
          height: { xs: 56, sm: 68 },
          overflow: "hidden",
          borderRadius: 2,
        }}
      >
        <WorkoutPlanVisual plan={plan} height="100%" compact />
      </Box>

      <Box minWidth={0}>
        <Stack direction="row" alignItems="center" gap={1}>
          <Typography variant="subtitle1" fontWeight={700} noWrap>
            {plan.name}
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" noWrap>
          {plan.description || plan.category}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          textTransform="capitalize"
          sx={{ display: { xs: "block", sm: "none" } }}
          noWrap
        >
          {plan.difficulty.toLowerCase()} · {formatDaysPerWeek(plan.daysPerWeek)} ·{" "}
          {formatCount(plan.exercises.length, "exercise")}
        </Typography>
      </Box>

      <Stack
        direction="row"
        alignItems="center"
        gap={2}
        sx={{ display: { xs: "none", sm: "flex" } }}
      >
        <Box sx={{ textAlign: "right" }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            gap={0.5}
          >
            <CalendarMonth sx={{ fontSize: 18, color: "text.secondary" }} />
            <Typography variant="body2" whiteSpace="nowrap">
              {formatDaysPerWeek(plan.daysPerWeek)}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            gap={0.5}
          >
            <Barbell
              sx={{ fontSize: 18, color: "text.secondary" }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              whiteSpace="nowrap"
            >
              {formatCount(plan.exercises.length, "exercise")}
            </Typography>
          </Stack>
        </Box>
        <IconButton
          component="span"
          aria-label={`View ${plan.name}`}
          sx={{ color: "text.secondary" }}
        >
          <ArrowForward />
        </IconButton>
      </Stack>
    </Box>
  );
}

export default function WorkoutPlanList({ plans }: { plans: WorkoutPlan[] }) {
  const splitAt = Math.ceil(plans.length / 2);
  const columns = [plans.slice(0, splitAt), plans.slice(splitAt)].filter(
    (column) => column.length > 0,
  );

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
          elevation={1}
          sx={{ overflow: "hidden" }}
        >
          <Stack divider={<Divider flexItem />}>
            {column.map((plan) => (
              <WorkoutPlanListRow key={plan.id} plan={plan} />
            ))}
          </Stack>
        </Paper>
      ))}
    </Box>
  );
}
