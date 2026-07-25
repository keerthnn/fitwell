import { Paper } from "@mui/material";
import AuthenticatedPage from "fitness/components/AuthenticatedPage";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import WorkoutPlanForm from "fitness/components/workout-plans/WorkoutPlanForm";
import { getWorkoutPlan } from "fitness/utils/spec";
import type { WorkoutPlan } from "fitness/utils/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditWorkoutPlanPage() {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : "";
  const [plan, setPlan] = useState<WorkoutPlan>();
  useEffect(() => { if (id) void getWorkoutPlan(id).then(setPlan); }, [id]);
  return <AuthenticatedPage>{!plan ? <LoadingState /> : <><PageHeader title="Edit Workout Plan" /><Paper sx={{ p: 4 }}><WorkoutPlanForm initial={plan} /></Paper></>}</AuthenticatedPage>;
}
