import { Grid } from "@mui/material";
import AuthenticatedPage from "fitness/components/AuthenticatedPage";
import EmptyState from "fitness/components/common/EmptyState";
import ErrorState from "fitness/components/common/ErrorState";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import WorkoutPlanCard from "fitness/components/workout-plans/WorkoutPlanCard";
import { listWorkoutPlans } from "fitness/utils/spec";
import type { WorkoutPlan } from "fitness/utils/types";
import { useEffect, useState } from "react";

export default function WorkoutPlansPage() {
  const [plans, setPlans] = useState<WorkoutPlan[]>();
  const [error, setError] = useState("");
  useEffect(() => {
    void listWorkoutPlans()
      .then((result) => setPlans(result.items))
      .catch(() => setError("Workout Plans could not be loaded."));
  }, []);
  return (
    <AuthenticatedPage>
      <PageHeader
        title="Workout Plans"
        description="Built-in programmes and your private plans."
        action={{ label: "Create Workout Plan", href: "/workout-plans/create" }}
      />
      {error ? (
        <ErrorState message={error} />
      ) : !plans ? (
        <LoadingState />
      ) : plans.length === 0 ? (
        <EmptyState
          title="No Workout Plans"
          description="Create a private plan to get started."
        />
      ) : (
        <Grid container spacing={2}>
          {plans.map((plan) => (
            <Grid key={plan.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <WorkoutPlanCard plan={plan} />
            </Grid>
          ))}
        </Grid>
      )}
    </AuthenticatedPage>
  );
}
