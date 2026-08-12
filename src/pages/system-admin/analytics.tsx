import {
  AccessTime,
  ArrowForward,
  CheckCircleOutline,
  ListAlt,
  People,
} from "fitness/components/common/icons";
import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import AdminLayout from "fitness/components/AdminLayout";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import DashboardStatCard from "fitness/components/dashboard/DashboardStatCard";
import { getAdminAnalytics } from "fitness/utils/spec";
import Link from "next/link";
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
        <Stack gap={3}>
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
                tone="neutral"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <DashboardStatCard
                icon={<AccessTime />}
                label="Training duration"
                value={summary.durationMinutes ?? 0}
                helper="minutes"
                tone="neutral"
              />
            </Grid>
          </Grid>
          <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" fontWeight={800}>
              Review the underlying activity
            </Typography>
            <Typography color="text.secondary" variant="body2" mt={0.5} mb={2}>
              These totals include local active accounts and completed workouts
              across all time.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} gap={1.5}>
              {[
                ["/system-admin/workouts", "Review workouts", ListAlt],
                ["/system-admin/users", "Review users", People],
              ].map(([href, label, Icon]) => (
                <Box
                  key={String(href)}
                  component={Link}
                  href={String(href)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    minHeight: 56,
                    px: 2,
                    borderRadius: 2,
                    bgcolor: "action.hover",
                    minWidth: { sm: 220 },
                    "&:hover": { bgcolor: "action.selected" },
                  }}
                >
                  <Icon color="action" />
                  <Typography fontWeight={700} flex={1}>
                    {String(label)}
                  </Typography>
                  <ArrowForward sx={{ color: "text.secondary", fontSize: 20 }} />
                </Box>
              ))}
            </Stack>
          </Paper>
        </Stack>
      )}
    </AdminLayout>
  );
}
