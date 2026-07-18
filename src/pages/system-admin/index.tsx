import { FitnessCenter, HealthAndSafety, ListAlt, People, Restaurant, TaskAlt, TrendingUp, Whatshot } from "@mui/icons-material";
import { Box, Button, Container, Paper, Stack, Typography } from "@mui/material";
import { AdminLayout } from "fitness/components/AdminLayout";
import { AdminPageGuard } from "fitness/components/AdminPageGuard";
import { getAdminDashboardStats } from "fitness/utils/spec";
import { AdminDashboardStats } from "fitness/utils/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function SystemAdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const router = useRouter();
  useEffect(() => { getAdminDashboardStats().then(setStats).catch(console.error); }, []);
  const cards = [
    ["Total users", stats?.totalUsers, <People key="i" />],
    ["Active users (30d)", stats?.activeUsers, <TrendingUp key="i" />],
    ["All workouts", stats?.totalWorkouts, <FitnessCenter key="i" />],
    ["Completed workouts", stats?.completedWorkouts, <TaskAlt key="i" />],
    ["Exercises", stats?.totalExercises, <Whatshot key="i" />],
    ["All templates", stats?.totalTemplates, <ListAlt key="i" />],
    ["Public templates", stats?.publicTemplates, <ListAlt key="i" />],
    ["Nutrition entries", stats?.nutritionEntries, <Restaurant key="i" />],
    ["Active injuries", stats?.activeInjuries, <HealthAndSafety key="i" />],
  ] as const;
  return <AdminPageGuard><AdminLayout><Box sx={{ py: 4 }}><Container maxWidth="xl"><Stack spacing={4}>
    <Box><Typography variant="h4" fontWeight={700}>Admin dashboard</Typography><Typography color="text.secondary">Complete overview of FitWell users, content, and activity.</Typography></Box>
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(3,1fr)", xl: "repeat(4,1fr)" }, gap: 2 }}>{cards.map(([label, value, icon]) => <Paper key={label} sx={{ p: 3 }}><Stack direction="row" justifyContent="space-between" color="primary.main">{icon}</Stack><Typography variant="h4" fontWeight={700} mt={2}>{value ?? "—"}</Typography><Typography color="text.secondary">{label}</Typography></Paper>)}</Box>
    <Paper sx={{ p: 3 }}><Typography variant="h6" mb={2}>Management</Typography><Stack direction={{ xs: "column", sm: "row" }} spacing={2}><Button variant="outlined" onClick={() => router.push("/system-admin/users")}>Manage users</Button><Button variant="outlined" onClick={() => router.push("/system-admin/exercises")}>Manage exercises</Button><Button variant="contained" onClick={() => router.push("/system-admin/templates")}>Manage templates</Button></Stack></Paper>
  </Stack></Container></Box></AdminLayout></AdminPageGuard>;
}
