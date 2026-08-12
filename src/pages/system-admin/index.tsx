import {
  ArrowForward,
  Barbell,
  ClipboardList,
  ListAlt,
  People,
  Stretching,
} from "fitness/components/common/icons";
import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import AdminLayout from "fitness/components/AdminLayout";
import ErrorState from "fitness/components/common/ErrorState";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import DashboardStatCard from "fitness/components/dashboard/DashboardStatCard";
import { getAdminSummary } from "fitness/utils/spec";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminOverviewPage() {
  const [summary, setSummary] = useState<Record<string, number>>();
  const [error, setError] = useState("");
  useEffect(() => {
    void getAdminSummary()
      .then(setSummary)
      .catch(() => setError("The admin overview could not be loaded."));
  }, []);
  const metrics = [
    {
      key: "users",
      label: "Active users",
      helper: "accounts",
      icon: <People />,
      tone: "neutral" as const,
    },
    {
      key: "workouts",
      label: "Workouts",
      helper: "all time",
      icon: <Barbell />,
      tone: "neutral" as const,
    },
    {
      key: "exercises",
      label: "Active exercises",
      helper: "catalogue",
      icon: <Stretching />,
      tone: "neutral" as const,
    },
    {
      key: "workoutPlans",
      label: "Built-in plans",
      helper: "published",
      icon: <ClipboardList />,
      tone: "neutral" as const,
    },
  ];
  return (
    <AdminLayout>
      <PageHeader
        title="Admin overview"
        description="Operational status for the local FitWell application."
      />
      {error ? (
        <ErrorState message={error} />
      ) : !summary ? (
        <LoadingState />
      ) : (
        <Stack gap={3}>
          <Grid container spacing={2}>
            {metrics.map((metric) => (
              <Grid key={metric.key} size={{ xs: 6, lg: 3 }}>
                <DashboardStatCard
                  icon={metric.icon}
                  label={metric.label}
                  value={summary[metric.key] ?? 0}
                  helper={metric.helper}
                  tone={metric.tone}
                />
              </Grid>
            ))}
          </Grid>
          <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" fontWeight={800} mb={0.5}>
              Quick management
            </Typography>
            <Typography color="text.secondary" variant="body2" mb={2}>
              Review the areas that shape the member experience and system
              access.
            </Typography>
            <Grid container spacing={1.5}>
              {[
                ["/system-admin/users", "Manage users", People],
                [
                  "/system-admin/exercises",
                  "Exercise catalogue",
                  Stretching,
                ],
                [
                  "/system-admin/workout-plans",
                  "Built-in plans",
                  ClipboardList,
                ],
                ["/system-admin/audit-logs", "Audit events", ListAlt],
              ].map(([href, label, Icon]) => (
                <Grid key={String(href)} size={{ xs: 12, sm: 6, lg: 3 }}>
                  <Box
                    component={Link}
                    href={String(href)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.25,
                      minHeight: 64,
                      px: 2,
                      borderRadius: 2,
                      bgcolor: "action.hover",
                      "&:hover": { bgcolor: "action.selected" },
                    }}
                  >
                    <Icon color="action" />
                    <Typography fontWeight={700} flex={1}>
                      {String(label)}
                    </Typography>
                    <ArrowForward sx={{ color: "text.secondary", fontSize: 20 }} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Stack>
      )}
    </AdminLayout>
  );
}
