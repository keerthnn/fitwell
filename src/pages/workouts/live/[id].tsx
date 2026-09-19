import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import AuthenticatedPage from "fitness/components/AuthenticatedPage";
import HeroSurface from "fitness/components/common/HeroSurface";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import { useRestTimer } from "fitness/components/RestTimerProvider";
import WorkoutExerciseEditor from "fitness/components/workouts/WorkoutExerciseEditor";
import {
  completeWorkout,
  getWorkoutById,
  pauseWorkout,
  resumeWorkout,
} from "fitness/utils/spec";
import type { Workout } from "fitness/utils/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type LifecycleAction = "pause" | "resume" | "complete";

export default function LiveWorkoutPage() {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : "";
  const [workout, setWorkout] = useState<Workout>();
  const [lifecycleAction, setLifecycleAction] =
    useState<LifecycleAction | null>(null);
  const [lifecycleError, setLifecycleError] = useState("");
  const {
    timer,
    start,
    pauseForWorkout,
    resumeForWorkout,
    clearForWorkout,
  } = useRestTimer();
  const reload = async () => {
    if (id) setWorkout(await getWorkoutById(id));
  };
  useEffect(() => {
    if (id) void getWorkoutById(id).then(setWorkout);
  }, [id]);

  useEffect(() => {
    if (!workout || timer?.workoutId !== workout.id) return;

    if (workout.status === "DRAFT" && timer.status === "running") {
      pauseForWorkout(workout.id);
    } else if (
      workout.status === "IN_PROGRESS" &&
      timer.status === "paused" &&
      timer.pauseReason === "workout"
    ) {
      resumeForWorkout(workout.id);
    } else if (workout.status === "COMPLETED") {
      clearForWorkout(workout.id);
    }
  }, [
    clearForWorkout,
    pauseForWorkout,
    resumeForWorkout,
    timer?.pauseReason,
    timer?.status,
    timer?.workoutId,
    workout,
  ]);

  const handlePause = async () => {
    if (!workout || lifecycleAction) return;
    setLifecycleAction("pause");
    setLifecycleError("");
    try {
      await pauseWorkout(workout.id);
      setWorkout((current) =>
        current ? { ...current, status: "DRAFT" } : current,
      );
      pauseForWorkout(workout.id);
    } catch {
      setLifecycleError(
        "The workout could not be paused. Please try again.",
      );
    } finally {
      setLifecycleAction(null);
    }
  };

  const handleResume = async () => {
    if (!workout || lifecycleAction) return;
    setLifecycleAction("resume");
    setLifecycleError("");
    try {
      await resumeWorkout(workout.id);
      setWorkout((current) =>
        current ? { ...current, status: "IN_PROGRESS" } : current,
      );
      resumeForWorkout(workout.id);
    } catch {
      setLifecycleError(
        "The workout could not be resumed. Please try again.",
      );
    } finally {
      setLifecycleAction(null);
    }
  };

  const handleComplete = async () => {
    if (!workout || lifecycleAction) return;
    setLifecycleAction("complete");
    setLifecycleError("");

    let completedWorkout: Workout;
    try {
      completedWorkout = await completeWorkout(workout.id);
    } catch {
      setLifecycleError(
        "The workout could not be completed. Please check your sets and try again.",
      );
      setLifecycleAction(null);
      return;
    }

    setWorkout((current) =>
      current
        ? {
            ...current,
            status: "COMPLETED",
            completedAt: completedWorkout.completedAt,
            durationMinutes: completedWorkout.durationMinutes,
          }
        : current,
    );
    clearForWorkout(workout.id);
    try {
      await router.push(`/workouts/${workout.id}`);
    } catch {
      setLifecycleError(
        "The workout was completed, but its details could not be opened.",
      );
    } finally {
      setLifecycleAction(null);
    }
  };

  const isPaused = workout?.status === "DRAFT";
  const isCompleted = workout?.status === "COMPLETED";
  const isEditingDisabled =
    workout?.status !== "IN_PROGRESS" || lifecycleAction !== null;

  return (
    <AuthenticatedPage>
      {!workout ? (
        <LoadingState />
      ) : (
        <>
          <PageHeader
            title={workout.name}
            backLink={{ label: "Back to workouts", href: "/workouts" }}
          />
          <HeroSurface tone="warning" sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ sm: "center" }}
              justifyContent="space-between"
              gap={2}
            >
              <Box>
                <Typography
                  variant="overline"
                  color="warning.main"
                  fontWeight={800}
                >
                  {isCompleted
                    ? "Workout completed"
                    : isPaused
                      ? "Workout paused"
                      : "Workout in progress"}
                </Typography>
                <Typography variant="h6">
                  {isCompleted
                    ? "Your completed session is ready to review."
                    : isPaused
                    ? "Resume when you’re ready to continue logging sets."
                    : "Keep the session focused and save each exercise before moving on."}
                </Typography>
              </Box>
              <Stack direction={{ xs: "column", sm: "row" }} gap={1.25}>
                {!isCompleted && (
                  <Button
                    variant="outlined"
                    onClick={isPaused ? handleResume : handlePause}
                    disabled={lifecycleAction !== null}
                  >
                    {lifecycleAction === (isPaused ? "resume" : "pause")
                      ? isPaused
                        ? "Resuming…"
                        : "Pausing…"
                      : isPaused
                        ? "Resume"
                        : "Pause"}
                  </Button>
                )}
                <Button
                  variant="contained"
                  onClick={handleComplete}
                  disabled={lifecycleAction !== null || isCompleted}
                >
                  {isCompleted
                    ? "Workout completed"
                    : lifecycleAction === "complete"
                    ? "Completing…"
                    : "Complete workout"}
                </Button>
              </Stack>
            </Stack>
          </HeroSurface>
          {lifecycleError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {lifecycleError}
            </Alert>
          )}
          <Alert severity="info" sx={{ mb: 3 }}>
            {isPaused
              ? "Set and exercise editing is disabled while this workout is paused."
              : "Use “Save sets” in each exercise panel after making changes."}
          </Alert>
          <WorkoutExerciseEditor
            workout={workout}
            onReload={reload}
            disabled={isEditingDisabled}
            onStartRest={(seconds) => start(workout.id, seconds)}
          />
        </>
      )}
    </AuthenticatedPage>
  );
}
