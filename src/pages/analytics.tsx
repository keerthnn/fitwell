import {
  Box,
  Button,
  Container,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import AuthenticatedPage from "fitness/components/AuthenticatedPage";
import { getAnalytics, saveWeightCheckIn } from "fitness/utils/spec";
import { AnalyticsSummary } from "fitness/utils/types";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Range = "week" | "month" | "quarter";
function dates(range: Range) {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const start = new Date(end);
  start.setDate(
    start.getDate() - (range === "week" ? 7 : range === "month" ? 30 : 90),
  );
  return { start, end };
}

export default function AnalyticsPage() {
  const [range, setRange] = useState<Range>("month");
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  useEffect(() => {
    const value = dates(range);
    getAnalytics(value.start, value.end).then(setData);
  }, [range]);
  return (
    <AuthenticatedPage>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4">Analytics</Typography>
            <Typography color="text.secondary">
              See how your training and body metrics change over time.
            </Typography>
          </Box>
          <Button
            sx={{ alignSelf: "flex-start" }}
            variant="outlined"
            onClick={async () => {
              const value = prompt("Current weight in kg");
              if (!value) return;
              await saveWeightCheckIn(Number(value));
              const selected = dates(range);
              setData(await getAnalytics(selected.start, selected.end));
            }}
          >
            Add weight check-in
          </Button>
          <Stack direction="row" spacing={1}>
            {(["week", "month", "quarter"] as Range[]).map((item) => (
              <Button
                key={item}
                variant={range === item ? "contained" : "outlined"}
                onClick={() => setRange(item)}
              >
                {item}
              </Button>
            ))}
          </Stack>
          {!data ? (
            <LinearProgress />
          ) : (
            <>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4,1fr)" },
                  gap: 2,
                }}
              >
                {[
                  ["Workouts", data.totals.workouts],
                  ["Duration", `${data.totals.durationM} min`],
                  ["Volume", `${Math.round(data.totals.volumeKg)} kg`],
                  ["Net calories", data.totals.netCalories],
                ].map(([label, value]) => (
                  <Paper key={label} sx={{ p: 3 }}>
                    <Typography variant="h5">{value}</Typography>
                    <Typography color="text.secondary">{label}</Typography>
                  </Paper>
                ))}
              </Box>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 3,
                }}
              >
                <Chart title="Muscle group distribution">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={data.muscleDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#2563eb" />
                    </BarChart>
                  </ResponsiveContainer>
                </Chart>
                <Chart title="Workout frequency">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={data.weekdayFrequency}>
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </Chart>
              </Box>
              {data.weightTrend.length > 0 && (
                <Chart title="Weight trend">
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={data.weightTrend}>
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) =>
                          new Date(value).toLocaleDateString()
                        }
                      />
                      <YAxis domain={["dataMin - 2", "dataMax + 2"]} />
                      <Tooltip />
                      <Line dataKey="weightKg" stroke="#2563eb" />
                    </LineChart>
                  </ResponsiveContainer>
                </Chart>
              )}
            </>
          )}
        </Stack>
      </Container>
    </AuthenticatedPage>
  );
}
function Chart({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" mb={2}>
        {title}
      </Typography>
      {children}
    </Paper>
  );
}
