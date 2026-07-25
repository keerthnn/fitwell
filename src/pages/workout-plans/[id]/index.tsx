import AuthenticatedPage from "fitness/components/AuthenticatedPage";
import ErrorState from "fitness/components/common/ErrorState";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import WorkoutPlanDetail from "fitness/components/workout-plans/WorkoutPlanDetail";
import {
  duplicateWorkoutPlan,
  getWorkoutPlan,
  startWorkoutFromPlan,
} from "fitness/utils/spec";
import type { WorkoutPlan } from "fitness/utils/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function WorkoutPlanDetailPage() {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : "";
  const [plan, setPlan] = useState<WorkoutPlan>();
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);

  useEffect(() => {
    if (!id) return;
    void getWorkoutPlan(id)
      .then((result) => {
        setLoadError("");
        setPlan(result);
      })
      .catch(() => setLoadError("The workout plan could not be loaded."));
  }, [id]);

  async function startWorkout() {
    if (!plan) return;
    setActionError("");
    setIsStarting(true);
    try {
      const workout = await startWorkoutFromPlan(plan.id);
      await router.push(`/workouts/live/${workout.id}`);
    } catch {
      setActionError("The workout could not be started. Please try again.");
      setIsStarting(false);
    }
  }

  async function duplicatePlan() {
    if (!plan) return;
    setActionError("");
    setIsDuplicating(true);
    try {
      const copy = await duplicateWorkoutPlan(plan.id);
      await router.push(`/workout-plans/${copy.id}`);
    } catch {
      setActionError("The workout plan could not be duplicated.");
      setIsDuplicating(false);
    }
  }

  return (
    <AuthenticatedPage>
      {loadError ? (
        <ErrorState message={loadError} />
      ) : !plan ? (
        <LoadingState />
      ) : (
        <>
          <PageHeader
            title={plan.name}
            description="Review the programme and start when you are ready."
            action={
              !plan.isBuiltIn
                ? {
                    label: "Edit plan",
                    href: `/workout-plans/${plan.id}/edit`,
                  }
                : undefined
            }
          />
          <WorkoutPlanDetail
            plan={plan}
            error={actionError}
            isStarting={isStarting}
            isDuplicating={isDuplicating}
            onStart={() => void startWorkout()}
            onDuplicate={() => void duplicatePlan()}
          />
        </>
      )}
    </AuthenticatedPage>
  );
}
