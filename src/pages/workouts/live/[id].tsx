import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import AuthenticatedPage from "fitness/components/AuthenticatedPage";
import HeroSurface from "fitness/components/common/HeroSurface";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import WorkoutExerciseEditor from "fitness/components/workouts/WorkoutExerciseEditor";
import {
  completeWorkout,
  getWorkoutById,
  pauseWorkout,
} from "fitness/utils/spec";
import type { Workout } from "fitness/utils/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function LiveWorkoutPage() {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : "";
  const [workout, setWorkout] = useState<Workout>();
  const reload = async () => {
    if (id) setWorkout(await getWorkoutById(id));
  };
  useEffect(() => {
    if (id) void getWorkoutById(id).then(setWorkout);
  }, [id]);
  return (
    <AuthenticatedPage>
      {!workout ? (
        <LoadingState />
      ) : (
        <>
          <PageHeader title={workout.name} />
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
                  Workout in progress
                </Typography>
                <Typography variant="h6">
                  Keep the session focused and save each exercise before moving
                  on.
                </Typography>
              </Box>
              <Stack direction={{ xs: "column", sm: "row" }} gap={1.25}>
                <Button
                  variant="outlined"
                  onClick={async () => {
                    await pauseWorkout(workout.id);
                    await router.push("/workouts");
                  }}
                >
                  Pause
                </Button>
                <Button
                  variant="contained"
                  onClick={async () => {
                    await completeWorkout(workout.id);
                    await router.push(`/workouts/${workout.id}`);
                  }}
                >
                  Complete workout
                </Button>
              </Stack>
            </Stack>
          </HeroSurface>
          <Alert severity="info" sx={{ mb: 3 }}>
            Use “Save sets” in each exercise panel after making changes.
          </Alert>
          <WorkoutExerciseEditor workout={workout} onReload={reload} />
        </>
      )}
    </AuthenticatedPage>
  );
}
