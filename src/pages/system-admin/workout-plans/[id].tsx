import { Button, Paper, Stack } from "@mui/material";
import AdminLayout from "fitness/components/AdminLayout";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import WorkoutPlanForm from "fitness/components/workout-plans/WorkoutPlanForm";
import { adminArchiveWorkoutPlan, adminRestoreWorkoutPlan, getWorkoutPlan } from "fitness/utils/spec";
import type { WorkoutPlan } from "fitness/utils/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function AdminWorkoutPlanPage() {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : "";
  const [plan, setPlan] = useState<WorkoutPlan>();
  useEffect(() => { if (id) void getWorkoutPlan(id, true).then(setPlan); }, [id]);
  return <AdminLayout>{!plan ? <LoadingState /> : <><PageHeader title={`Edit ${plan.name}`} /><Paper sx={{ p: 3 }}><Stack gap={3}><WorkoutPlanForm initial={plan} admin /><Button color={plan.isArchived ? "success" : "warning"} onClick={async () => { if (plan.isArchived) await adminRestoreWorkoutPlan(plan.id); else await adminArchiveWorkoutPlan(plan.id); await router.push("/system-admin/workout-plans"); }}>{plan.isArchived ? "Restore Workout Plan" : "Archive Workout Plan"}</Button></Stack></Paper></>}</AdminLayout>;
}
