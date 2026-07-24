import { Button, Paper, Stack, Typography } from "@mui/material";
import AuthenticatedPage from "fitness/components/AuthenticatedPage";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import { duplicateWorkoutPlan, getWorkoutPlan, startWorkoutFromPlan } from "fitness/utils/spec";
import type { WorkoutPlan } from "fitness/utils/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function WorkoutPlanDetailPage() {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : "";
  const [plan, setPlan] = useState<WorkoutPlan>();
  useEffect(() => { if (id) void getWorkoutPlan(id).then(setPlan); }, [id]);
  return <AuthenticatedPage>{!plan ? <LoadingState /> : <>
    <PageHeader title={plan.name} action={!plan.isBuiltIn ? { label: "Edit", href: `/workout-plans/${plan.id}/edit` } : undefined} />
    <Paper sx={{ p: 4 }}><Stack gap={2}>
      <Typography color="text.secondary">{plan.description}</Typography>
      {plan.exercises.map((item) => <Typography key={item.id ?? `${item.exerciseId}-${item.order}`}>{item.order + 1}. {item.exercise?.name ?? "Exercise"} · {item.sets} sets</Typography>)}
      <Button variant="contained" onClick={async () => { const workout = await startWorkoutFromPlan(plan.id); await router.push(`/workouts/live/${workout.id}`); }}>Start workout</Button>
      <Button onClick={async () => { const copy = await duplicateWorkoutPlan(plan.id); await router.push(`/workout-plans/${copy.id}`); }}>Duplicate plan</Button>
    </Stack></Paper>
  </>}</AuthenticatedPage>;
}
