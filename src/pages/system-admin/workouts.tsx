import { Button, Chip, Stack, Typography } from "@mui/material";
import AdminLayout from "fitness/components/AdminLayout";
import AdminDataList from "fitness/components/admin/layout/AdminDataList";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import { adminDeleteWorkout, getAdminWorkouts } from "fitness/utils/spec";
import type { AdminWorkoutListItem } from "fitness/utils/types";
import { useCallback, useEffect, useState } from "react";

export default function AdminWorkoutsPage() {
  const [items, setItems] = useState<AdminWorkoutListItem[]>();
  const load = useCallback(
    () => getAdminWorkouts().then((result) => setItems(result.items)),
    [],
  );
  useEffect(() => {
    void load();
  }, [load]);
  return (
    <AdminLayout>
      <PageHeader
        title="Workouts"
        description="Review workout activity and remove invalid records."
      />
      {!items ? (
        <LoadingState />
      ) : (
        <AdminDataList
          items={items}
          empty="No workouts"
          render={(item) => {
            return (
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                gap={2}
              >
                <Stack minWidth={0}>
                  <Stack
                    direction="row"
                    gap={1}
                    alignItems="center"
                    flexWrap="wrap"
                  >
                    <Typography fontWeight={700}>
                      {item.name}
                    </Typography>
                    <Chip
                      size="small"
                      color={
                        item.status === "COMPLETED"
                          ? "success"
                          : item.status === "IN_PROGRESS"
                            ? "primary"
                            : "warning"
                      }
                      label={item.status.replaceAll("_", " ")}
                    />
                  </Stack>
                  <Typography color="text.secondary" variant="body2">
                    {item.user.displayName ?? item.user.email} ·{" "}
                    {item._count.exercises} exercises
                  </Typography>
                </Stack>
                <Button
                  color="error"
                  onClick={async () => {
                    await adminDeleteWorkout(item.id);
                    await load();
                  }}
                >
                  Delete
                </Button>
              </Stack>
            );
          }}
        />
      )}
    </AdminLayout>
  );
}
