import { Button, Card, CardContent, CardMedia, Chip, Stack, Typography } from "@mui/material";
import type { WorkoutPlan } from "fitness/utils/types";
import Link from "next/link";

export default function WorkoutPlanCard({ plan }: { plan: WorkoutPlan }) {
  return (
    <Card variant="outlined">
      <CardMedia component="img" height={160} image={plan.coverImagePath ?? "/images/workout-plans/fallback.svg"} alt="" sx={{ objectFit: "cover" }} />
      <CardContent>
        <Stack direction="row" justifyContent="space-between"><Typography variant="h6">{plan.name}</Typography>{plan.isBuiltIn && <Chip size="small" label="Built-in" />}</Stack>
        <Typography color="text.secondary">{plan.difficulty.toLowerCase()} · {plan.daysPerWeek} days/week</Typography>
        <Button component={Link} href={`/workout-plans/${plan.id}`} sx={{ mt: 2 }}>View plan</Button>
      </CardContent>
    </Card>
  );
}
