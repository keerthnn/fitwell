import {
  Box,
  Button,
  Container,
  MenuItem,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import AuthenticatedPage from "fitness/components/AuthenticatedPage";
import { AdminAnalyticsChart } from "fitness/components/admin/AdminAnalyticsChart";
import {
  AnalyticsError,
  AnalyticsLoading,
  RankedList,
  StatGrid,
} from "fitness/components/admin/AdminAnalyticsShared";
import {
  getPersonalAnalyticsDashboard,
  saveWeightCheckIn,
} from "fitness/utils/spec";
import type {
  AdminAnalyticsGrouping,
  AdminAnalyticsQuery,
  AdminAnalyticsRange,
  PersonalAnalyticsDashboard,
} from "fitness/utils/types";
import { useEffect, useMemo, useState } from "react";

const tabs = [
  "overview",
  "workouts",
  "templates",
  "nutrition",
  "health",
  "weight",
  "achievements",
] as const;
type AnalyticsTab = (typeof tabs)[number];

const rangeOptions: Array<[AdminAnalyticsRange, string]> = [
  ["TODAY", "Today"],
  ["LAST_7_DAYS", "Last 7 days"],
  ["LAST_30_DAYS", "Last 30 days"],
  ["THIS_MONTH", "This month"],
  ["THIS_YEAR", "This year"],
  ["CUSTOM", "Custom range"],
  ["ALL_TIME", "All time"],
];

const groupingOptions: Array<[AdminAnalyticsGrouping, string]> = [
  ["AUTO", "Automatic grouping"],
  ["DAY", "Daily"],
  ["WEEK", "Weekly"],
  ["MONTH", "Monthly"],
  ["YEAR", "Yearly"],
];

const colors = {
  primary: "#7c3aed",
  secondary: "#0ea5e9",
  success: "#22c55e",
  warning: "#f59e0b",
};

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function defaultCustomDates() {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 29);
  return { start: isoDate(start), end: isoDate(end) };
}

function errorMessage(error: unknown) {
  if (typeof error === "object" && error && "response" in error) {
    const response = (error as { response?: { data?: { error?: string } } })
      .response;
    if (response?.data?.error) return response.data.error;
  }
  return error instanceof Error ? error.message : "Unable to load analytics";
}

function WorkoutsView({
  data,
}: {
  data: PersonalAnalyticsDashboard["workouts"];
}) {
  return (
    <Stack spacing={3}>
      <StatGrid
        items={[
          { label: "Total workouts", value: data.total },
          { label: "Completed", value: data.completed },
          { label: "Incomplete", value: data.incomplete },
          { label: "Created in period", value: data.createdInPeriod },
          { label: "Duration", value: `${data.durationM} min` },
          { label: "Calories burned", value: data.caloriesBurned },
        ]}
      />
      <AdminAnalyticsChart
        title="Workout activity"
        data={data.series}
        series={[
          { key: "created", label: "Created", color: colors.primary },
          { key: "completed", label: "Completed", color: colors.success },
        ]}
      />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
        }}
      >
        <RankedList title="Workout status" items={data.statusDistribution} />
        <RankedList title="Activity by weekday" items={data.weekdayFrequency} />
      </Box>
    </Stack>
  );
}

function TemplatesView({
  data,
}: {
  data: PersonalAnalyticsDashboard["templates"];
}) {
  return (
    <Stack spacing={3}>
      <StatGrid
        items={[
          { label: "Total templates", value: data.total },
          { label: "Public", value: data.public },
          { label: "Private", value: data.private },
          { label: "Unlisted", value: data.unlisted },
          { label: "Active", value: data.active },
          { label: "Archived", value: data.archived },
          { label: "Created in period", value: data.createdInPeriod },
          {
            label: "Uses / copies",
            value: `${data.usesInPeriod} / ${data.copiesInPeriod}`,
          },
        ]}
      />
      <AdminAnalyticsChart
        title="Template activity"
        data={data.series}
        series={[
          { key: "created", label: "Created", color: colors.primary },
          { key: "uses", label: "Uses", color: colors.success },
          { key: "copies", label: "Copies", color: colors.secondary },
        ]}
      />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 3,
        }}
      >
        <RankedList title="Visibility" items={data.visibilityDistribution} />
        <RankedList title="Most used" items={data.mostUsed} />
        <RankedList title="Most copied" items={data.mostCopied} />
      </Box>
    </Stack>
  );
}

function NutritionView({
  data,
}: {
  data: PersonalAnalyticsDashboard["nutrition"];
}) {
  return (
    <Stack spacing={3}>
      <StatGrid
        items={[
          { label: "Total entries", value: data.total },
          { label: "Entries in period", value: data.entriesInPeriod },
        ]}
      />
      <AdminAnalyticsChart
        title="Nutrition logging"
        data={data.series}
        variant="bar"
        series={[{ key: "entries", label: "Entries", color: colors.primary }]}
      />
    </Stack>
  );
}

function HealthView({ data }: { data: PersonalAnalyticsDashboard["health"] }) {
  return (
    <Stack spacing={3}>
      <StatGrid
        items={[
          { label: "Total injuries", value: data.totalInjuries },
          { label: "Active injuries", value: data.active },
          { label: "Recovered", value: data.recovered },
          { label: "Added in period", value: data.addedInPeriod },
        ]}
      />
      <AdminAnalyticsChart
        title="Injury activity"
        data={data.series}
        variant="bar"
        series={[
          {
            key: "injuriesAdded",
            label: "Injuries added",
            color: colors.warning,
          },
        ]}
      />
    </Stack>
  );
}

function WeightView({
  data,
  onAdd,
}: {
  data: PersonalAnalyticsDashboard["weight"];
  onAdd: () => void;
}) {
  return (
    <Stack spacing={3}>
      <Button
        variant="outlined"
        onClick={onAdd}
        sx={{ alignSelf: "flex-start" }}
      >
        Add weight check-in
      </Button>
      <StatGrid
        items={[
          { label: "Total check-ins", value: data.total },
          { label: "Check-ins in period", value: data.entriesInPeriod },
        ]}
      />
      <AdminAnalyticsChart
        title="Weight check-ins"
        data={data.series}
        variant="bar"
        series={[
          { key: "checkIns", label: "Check-ins", color: colors.secondary },
        ]}
      />
    </Stack>
  );
}

function AchievementsView({
  data,
}: {
  data: PersonalAnalyticsDashboard["achievements"];
}) {
  return (
    <Stack spacing={3}>
      <StatGrid
        items={[
          { label: "Total awards", value: data.totalAwarded },
          { label: "Awards in period", value: data.awardedInPeriod },
        ]}
      />
      <AdminAnalyticsChart
        title="Achievement awards"
        data={data.series}
        variant="bar"
        series={[{ key: "awards", label: "Awards", color: colors.success }]}
      />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
        }}
      >
        <RankedList title="Most frequently earned" items={data.mostEarned} />
        <RankedList title="Least frequently earned" items={data.leastEarned} />
      </Box>
    </Stack>
  );
}

export default function AnalyticsPage() {
  const defaults = useMemo(() => defaultCustomDates(), []);
  const [tab, setTab] = useState<AnalyticsTab>("overview");
  const [range, setRange] = useState<AdminAnalyticsRange>("LAST_30_DAYS");
  const [groupBy, setGroupBy] = useState<AdminAnalyticsGrouping>("AUTO");
  const [start, setStart] = useState(defaults.start);
  const [end, setEnd] = useState(defaults.end);
  const [data, setData] = useState<PersonalAnalyticsDashboard | null>(null);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);

  const query = useMemo<AdminAnalyticsQuery>(
    () => ({ range, groupBy, ...(range === "CUSTOM" ? { start, end } : {}) }),
    [range, groupBy, start, end],
  );
  const queryKey = JSON.stringify(query);

  useEffect(() => {
    let active = true;
    getPersonalAnalyticsDashboard(query)
      .then((result) => {
        if (active) {
          setData(result);
          setError("");
        }
      })
      .catch((requestError) => {
        if (active) {
          setData(null);
          setError(errorMessage(requestError));
        }
      });
    return () => {
      active = false;
    };
  }, [queryKey, refresh]); // eslint-disable-line react-hooks/exhaustive-deps

  const addWeightCheckIn = async () => {
    const value = prompt("Current weight in kg");
    if (!value) return;
    const weightKg = Number(value);
    if (!Number.isFinite(weightKg) || weightKg <= 0) {
      alert("Enter a valid weight in kilograms.");
      return;
    }
    await saveWeightCheckIn(weightKg);
    setRefresh((value) => value + 1);
  };

  const content = () => {
    if (!data) return null;
    if (tab === "workouts") return <WorkoutsView data={data.workouts} />;
    if (tab === "templates") return <TemplatesView data={data.templates} />;
    if (tab === "nutrition") return <NutritionView data={data.nutrition} />;
    if (tab === "health") return <HealthView data={data.health} />;
    if (tab === "weight")
      return <WeightView data={data.weight} onAdd={addWeightCheckIn} />;
    if (tab === "achievements")
      return <AchievementsView data={data.achievements} />;
    return (
      <StatGrid
        items={[
          { label: "Total workouts", value: data.workouts.total },
          { label: "Templates", value: data.templates.total },
          { label: "Nutrition entries", value: data.nutrition.total },
          { label: "Active injuries", value: data.health.active },
          { label: "Weight check-ins", value: data.weight.total },
          { label: "Achievements", value: data.achievements.totalAwarded },
        ]}
      />
    );
  };

  return (
    <AuthenticatedPage>
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Your analytics
              </Typography>
              <Typography color="text.secondary">
                Explore your training, templates, nutrition, health, weight, and
                achievements over time.
              </Typography>
            </Box>

            <Paper sx={{ p: 2 }}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                alignItems={{ md: "center" }}
              >
                <TextField
                  select
                  size="small"
                  label="Date range"
                  value={range}
                  onChange={(event) =>
                    setRange(event.target.value as AdminAnalyticsRange)
                  }
                  sx={{ minWidth: { xs: 0, md: 190 } }}
                >
                  {rangeOptions.map(([value, label]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </TextField>
                {range === "CUSTOM" && (
                  <>
                    <TextField
                      size="small"
                      type="date"
                      label="Start"
                      value={start}
                      InputLabelProps={{ shrink: true }}
                      onChange={(event) => setStart(event.target.value)}
                    />
                    <TextField
                      size="small"
                      type="date"
                      label="End"
                      value={end}
                      InputLabelProps={{ shrink: true }}
                      onChange={(event) => setEnd(event.target.value)}
                    />
                  </>
                )}
                <TextField
                  select
                  size="small"
                  label="Chart grouping"
                  value={groupBy}
                  onChange={(event) =>
                    setGroupBy(event.target.value as AdminAnalyticsGrouping)
                  }
                  sx={{ minWidth: { xs: 0, md: 200 } }}
                >
                  {groupingOptions.map(([value, label]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </TextField>
                <Box sx={{ flex: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Timezone: {data?.metadata.timezone ?? "Loading…"}
                </Typography>
              </Stack>
            </Paper>

            <TextField
              select
              size="small"
              label="Analytics section"
              value={tab}
              onChange={(event) => setTab(event.target.value as AnalyticsTab)}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {tabs.map((item) => (
                <MenuItem key={item} value={item}>
                  {item[0].toUpperCase() + item.slice(1)}
                </MenuItem>
              ))}
            </TextField>
            <Tabs
              value={tab}
              onChange={(_, value) => setTab(value)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              {tabs.map((item) => (
                <Tab key={item} value={item} label={item} />
              ))}
            </Tabs>

            {error ? (
              <AnalyticsError
                message={error}
                retry={() => setRefresh((value) => value + 1)}
              />
            ) : data ? (
              content()
            ) : (
              <AnalyticsLoading />
            )}
          </Stack>
        </Container>
      </Box>
    </AuthenticatedPage>
  );
}
