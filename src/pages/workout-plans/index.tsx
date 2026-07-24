import AuthenticatedPage from "fitness/components/AuthenticatedPage";
import EmptyState from "fitness/components/common/EmptyState";
import ErrorState from "fitness/components/common/ErrorState";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import WorkoutPlanList from "fitness/components/workout-plans/WorkoutPlanList";
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
        <WorkoutPlanList plans={plans} />
      )}
    </AuthenticatedPage>
  );
}
