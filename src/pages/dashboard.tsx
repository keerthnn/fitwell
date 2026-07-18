import { LocalFireDepartment, Restaurant, Shield, TrendingUp } from "@mui/icons-material";
import { Alert, Box, Button, Container, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import AuthenticatedPage from "fitness/components/AuthenticatedPage";
import { getDashboardSummary } from "fitness/utils/spec";
import { DashboardSummary } from "fitness/utils/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [data, setData] = useState<DashboardSummary | null>(null); const [error, setError] = useState(""); const router = useRouter();
  useEffect(() => { getDashboardSummary().then(setData).catch(() => setError("Could not load your dashboard.")); }, []);
  return <AuthenticatedPage><Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 4 }}><Container maxWidth="lg"><Stack spacing={4}>
    <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2}><Box><Typography variant="h4" fontWeight={700}>Dashboard</Typography><Typography color="text.secondary">Your training, nutrition, and consistency at a glance.</Typography></Box><Button variant="contained" onClick={() => router.push("/workouts/create")}>Start workout</Button></Stack>
    {error && <Alert severity="error">{error}</Alert>}{!data && !error && <LinearProgress />}
    {data && <><Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 2 }}>
      <Stat icon={<LocalFireDepartment />} value={`${data.streak.current} days`} label="Current streak" />
      <Stat icon={<TrendingUp />} value={`${data.workouts.thisWeek}/${data.workouts.weeklyTarget}`} label="Weekly goal" />
      <Stat icon={<Restaurant />} value={`${data.calories.remaining} kcal`} label="Remaining today" />
      <Stat icon={<Shield />} value={String(data.activeHealthCount)} label="Active health notes" />
    </Box>
    <Paper sx={{ p: 3 }}><Typography variant="h6">Weekly progress</Typography><Typography color="text.secondary" mb={2}>{data.workouts.thisMonth} workouts this month · best streak {data.streak.best} days</Typography><LinearProgress variant="determinate" value={Math.min(100, data.workouts.thisWeek / data.workouts.weeklyTarget * 100)} sx={{ height: 10, borderRadius: 5 }} /></Paper>
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" }, gap: 3 }}><Paper sx={{ p: 3 }}><Typography variant="h6" mb={2}>Recent workouts</Typography>{data.recentWorkouts.length ? <Stack spacing={2}>{data.recentWorkouts.map((workout) => <Box key={workout.id} onClick={() => router.push(`/workouts/${workout.id}`)} sx={{ cursor: "pointer" }}><Typography fontWeight={600}>{workout.title || "Untitled workout"}</Typography><Typography variant="body2" color="text.secondary">{new Date(workout.date).toLocaleDateString()} · {workout.exerciseCount} exercises · {workout.caloriesBurned ?? 0} kcal</Typography></Box>)}</Stack> : <Typography color="text.secondary">Complete your first workout to see activity here.</Typography>}</Paper>
    <Paper sx={{ p: 3 }}><Typography variant="h6">Today&apos;s calories</Typography><Stack spacing={1.5} mt={2}><Metric label="Consumed" value={data.calories.consumed} /><Metric label="Workout burn" value={data.calories.burned} /><Metric label="Net" value={data.calories.net} /><Metric label="Target" value={data.calories.target} /></Stack><Button sx={{ mt: 2 }} onClick={() => router.push("/nutrition")}>Open nutrition</Button></Paper></Box>
    {data.latestAchievements.length > 0 && <Paper sx={{ p: 3 }}><Typography variant="h6" mb={2}>Latest achievements</Typography><Stack direction="row" flexWrap="wrap" gap={2}>{data.latestAchievements.map((item) => <Box key={item.key}><Typography fontSize={28}>{item.icon}</Typography><Typography fontWeight={600}>{item.name}</Typography></Box>)}</Stack></Paper>}</>}
  </Stack></Container></Box></AuthenticatedPage>;
}
function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) { return <Paper sx={{ p: 3 }}><Box color="primary.main">{icon}</Box><Typography variant="h5" mt={1}>{value}</Typography><Typography color="text.secondary" variant="body2">{label}</Typography></Paper>; }
function Metric({ label, value }: { label: string; value: number }) { return <Stack direction="row" justifyContent="space-between"><Typography color="text.secondary">{label}</Typography><Typography fontWeight={600}>{value} kcal</Typography></Stack>; }
