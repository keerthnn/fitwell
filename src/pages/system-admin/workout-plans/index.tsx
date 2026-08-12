import { ArrowForward } from "@mui/icons-material";
import { Box, Chip, Stack, Typography } from "@mui/material";
import AdminLayout from "fitness/components/AdminLayout";
import AdminDataList from "fitness/components/admin/layout/AdminDataList";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import WorkoutPlanVisual from "fitness/components/workout-plans/WorkoutPlanVisual";
import { listWorkoutPlans } from "fitness/utils/spec";
import { formatDaysPerWeek } from "fitness/utils/copy";
import type { WorkoutPlan } from "fitness/utils/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminWorkoutPlansPage() {
  const [items, setItems] = useState<WorkoutPlan[]>();
  useEffect(() => {
    void listWorkoutPlans({ includeArchived: "true" }).then((result) =>
      setItems(result.items.filter((item) => item.isBuiltIn)),
    );
  }, []);
  return (
    <AdminLayout>
      <PageHeader
        title="Workout Plans"
        description="Create and maintain FitWell's built-in training plans."
        action={{
          label: "New built-in plan",
          href: "/system-admin/workout-plans/new",
        }}
      />
      {!items ? (
        <LoadingState />
      ) : (
        <AdminDataList
          items={items}
          empty="No built-in Workout Plans"
          render={(item) => (
            <Box
              component={Link}
              href={`/system-admin/workout-plans/${item.id}`}
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "58px minmax(0, 1fr) auto",
                  sm: "76px minmax(0, 1fr) auto",
                },
                alignItems: "center",
                gap: 2,
                borderRadius: 2,
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <Box
                sx={{
                  width: { xs: 58, sm: 76 },
                  height: { xs: 52, sm: 62 },
                  overflow: "hidden",
                  borderRadius: 2,
                }}
              >
                <WorkoutPlanVisual plan={item} height="100%" compact />
              </Box>
              <Stack minWidth={0}>
                <Typography fontWeight={700} noWrap>
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.difficulty} · {formatDaysPerWeek(item.daysPerWeek)}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" gap={1.5}>
                <Chip
                  size="small"
                  color={item.isArchived ? "warning" : "success"}
                  label={item.isArchived ? "Archived" : "Active"}
                />
                <ArrowForward sx={{ color: "text.secondary", fontSize: 20 }} />
              </Stack>
            </Box>
          )}
        />
      )}
    </AdminLayout>
  );
}
