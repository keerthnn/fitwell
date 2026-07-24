import {
  FitnessCenter,
  People,
  PlaylistAddCheck,
  SportsGymnastics,
} from "@mui/icons-material";
import { Grid } from "@mui/material";
import AdminLayout from "fitness/components/AdminLayout";
import ErrorState from "fitness/components/common/ErrorState";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import DashboardStatCard from "fitness/components/dashboard/DashboardStatCard";
import { getAdminSummary } from "fitness/utils/spec";
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
      tone: "primary" as const,
    },
    {
      key: "workouts",
      label: "Workouts",
      helper: "all time",
      icon: <SportsGymnastics />,
      tone: "success" as const,
    },
    {
      key: "exercises",
      label: "Active exercises",
      helper: "catalogue",
      icon: <FitnessCenter />,
      tone: "warning" as const,
    },
    {
      key: "workoutPlans",
      label: "Built-in plans",
      helper: "published",
      icon: <PlaylistAddCheck />,
      tone: "info" as const,
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
      )}
    </AdminLayout>
  );
}
