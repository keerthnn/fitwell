import { ContentCopy, Edit, Notes, Schedule } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import AuthenticatedPage from "fitness/components/AuthenticatedPage";
import ErrorState from "fitness/components/common/ErrorState";
import FitWellImage from "fitness/components/common/FitWellImage";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import SectionHeader from "fitness/components/common/SectionHeader";
import StatusChip from "fitness/components/common/StatusChip";
import DeleteWorkoutButton from "fitness/components/workouts/DeleteWorkoutButton";
import { resolveExerciseImageCandidates } from "fitness/lib/images/assetRegistry";
import { duplicateWorkout, getWorkoutById } from "fitness/utils/spec";
import type { Workout } from "fitness/utils/types";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function WorkoutDetailPage() {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : "";
  const [workout, setWorkout] = useState<Workout>();
  const [error, setError] = useState("");
  const [duplicating, setDuplicating] = useState(false);
  useEffect(() => {
    if (!id) return;
    void getWorkoutById(id)
      .then(setWorkout)
      .catch(() => setError("This workout could not be loaded."));
  }, [id]);
  return (
    <AuthenticatedPage>
      {error ? (
        <ErrorState message={error} />
      ) : !workout ? (
        <LoadingState />
      ) : (
        <>
          <PageHeader
            title={workout.name}
            description={new Date(workout.workoutDate).toLocaleDateString()}
            action={{
              label: "Edit workout",
              href: `/workouts/${workout.id}/edit`,
            }}
          />
          <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 4 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 6, md: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  Status
                </Typography>
                <Stack mt={0.75} alignItems="flex-start">
                  <StatusChip status={workout.status} />
                </Stack>
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  Duration
                </Typography>
                <Stack direction="row" gap={0.75} mt={0.5} alignItems="center">
                  <Schedule fontSize="small" color="action" />
                  <Typography fontWeight={700}>
                    {workout.durationMinutes ?? 0} min
                  </Typography>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  gap={1}
                  justifyContent="flex-end"
                >
                  <Button
                    component={Link}
                    href={`/workouts/${workout.id}/edit`}
                    startIcon={<Edit />}
                  >
                    Edit
                  </Button>
                  <Button
                    startIcon={<ContentCopy />}
                    disabled={duplicating}
                    onClick={async () => {
                      setDuplicating(true);
                      try {
                        const result = await duplicateWorkout(workout.id);
                        await router.push(`/workouts/${result.id}/edit`);
                      } finally {
                        setDuplicating(false);
                      }
                    }}
                  >
                    {duplicating ? "Duplicating…" : "Duplicate"}
                  </Button>
                  <DeleteWorkoutButton
                    workoutId={workout.id}
                    workoutName={workout.name}
                  />
                </Stack>
              </Grid>
            </Grid>
          </Paper>
          <SectionHeader>Exercises</SectionHeader>
          <Stack gap={2}>
            {workout.exercises.map((item) => (
              <Card key={item.id} variant="outlined">
                <Grid container>
                  <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                    <FitWellImage
                      candidates={resolveExerciseImageCandidates(item.exercise)}
                      alt={`${item.exercise.name} exercise illustration`}
                      aspectRatio="4 / 3"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 8, md: 9 }}>
                    <CardContent>
                      <Typography variant="h6">{item.exercise.name}</Typography>
                      <Typography color="text.secondary" variant="body2">
                        {item.exercise.primaryMuscle} ·{" "}
                        {item.exercise.equipment.toLowerCase()}
                      </Typography>
                      <Typography mt={2}>
                        {item.sets.filter((set) => set.isCompleted).length} of{" "}
                        {item.sets.length} sets completed
                      </Typography>
                      {item.notes && (
                        <Stack
                          direction="row"
                          gap={1}
                          mt={2}
                          color="text.secondary"
                        >
                          <Notes fontSize="small" />
                          <Typography variant="body2">{item.notes}</Typography>
                        </Stack>
                      )}
                    </CardContent>
                  </Grid>
                </Grid>
              </Card>
            ))}
          </Stack>
          {workout.notes && (
            <Paper sx={{ p: 3, mt: 4 }}>
              <Typography variant="h6">Workout notes</Typography>
              <Typography color="text.secondary" mt={1}>
                {workout.notes}
              </Typography>
            </Paper>
          )}
        </>
      )}
    </AuthenticatedPage>
  );
}
