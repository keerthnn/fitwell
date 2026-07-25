import { Button, Paper, Stack } from "@mui/material";
import AdminLayout from "fitness/components/AdminLayout";
import ExerciseAdminForm from "fitness/components/admin/exercises/ExerciseAdminForm";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import {
  adminArchiveExercise,
  adminRestoreExercise,
  getExerciseById,
} from "fitness/utils/spec";
import type { Exercise } from "fitness/utils/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function AdminExercisePage() {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : "";
  const [exercise, setExercise] = useState<Exercise>();
  useEffect(() => {
    if (id) void getExerciseById(id, true).then(setExercise);
  }, [id]);
  return (
    <AdminLayout>
      {!exercise ? (
        <LoadingState />
      ) : (
        <>
          <PageHeader
            title={`Edit ${exercise.name}`}
            description="Update exercise details, tracking, and availability."
          />
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Stack gap={3}>
              <ExerciseAdminForm initial={exercise} />
              <Button
                color={exercise.isActive ? "warning" : "success"}
                variant="outlined"
                onClick={async () => {
                  if (exercise.isActive)
                    await adminArchiveExercise(exercise.id);
                  else await adminRestoreExercise(exercise.id);
                  await router.push("/system-admin/exercises");
                }}
              >
                {exercise.isActive ? "Archive exercise" : "Restore exercise"}
              </Button>
            </Stack>
          </Paper>
        </>
      )}
    </AdminLayout>
  );
}
