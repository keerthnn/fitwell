import { AccessTime, CheckCircleOutline, People } from "@mui/icons-material";
import { Grid } from "@mui/material";
import AdminLayout from "fitness/components/AdminLayout";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import DashboardStatCard from "fitness/components/dashboard/DashboardStatCard";
import { getAdminAnalytics } from "fitness/utils/spec";
import { useEffect, useState } from "react";

export default function AdminAnalyticsPage() {
  const [summary, setSummary] = useState<Record<string, number>>();
  useEffect(() => {
    void getAdminAnalytics().then(setSummary);
  }, []);
  return (
    <AdminLayout>
      <PageHeader
        title="Analytics"
        description="Platform-wide activity and completed workout totals."
      />
      {!summary ? (
        <LoadingState />
      ) : (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <DashboardStatCard
              icon={<CheckCircleOutline />}
              label="Completed workouts"
              value={summary.completedWorkouts ?? 0}
              helper="all time"
              tone="success"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <DashboardStatCard
              icon={<People />}
              label="Active users"
              value={summary.activeUsers ?? 0}
              helper="accounts"
              tone="primary"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <DashboardStatCard
              icon={<AccessTime />}
              label="Training duration"
              value={summary.durationMinutes ?? 0}
              helper="minutes"
              tone="info"
            />
          </Grid>
        </Grid>
      )}
    </AdminLayout>
  );
}
