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
import { AdminLayout } from "fitness/components/AdminLayout";
import { AdminPageGuard } from "fitness/components/AdminPageGuard";
import { AdminAnalyticsChart } from "fitness/components/admin/AdminAnalyticsChart";
import {
  AnalyticsError,
  AnalyticsLoading,
  RankedList,
  StatGrid,
} from "fitness/components/admin/AdminAnalyticsShared";
import {
  getAdminAchievementsAnalytics,
  getAdminDashboardSummary,
  getAdminHealthAnalytics,
  getAdminNutritionAnalytics,
  getAdminTemplatesAnalytics,
  getAdminUsersAnalytics,
  getAdminWeightAnalytics,
  getAdminWorkoutsAnalytics,
} from "fitness/utils/spec";
import type {
  AdminAchievementsAnalytics,
  AdminAnalyticsGrouping,
  AdminAnalyticsQuery,
  AdminAnalyticsRange,
  AdminHealthAnalytics,
  AdminNutritionAnalytics,
  AdminSummaryAnalytics,
  AdminTemplatesAnalytics,
  AdminUsersAnalytics,
  AdminWeightAnalytics,
  AdminWorkoutsAnalytics,
} from "fitness/utils/types";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";

const tabs = [
  "overview",
  "users",
  "workouts",
  "templates",
  "nutrition",
  "health",
  "weight",
  "achievements",
] as const;
type DashboardTab = (typeof tabs)[number];
type DomainTab = Exclude<DashboardTab, "overview">;
type DomainData = {
  users: AdminUsersAnalytics;
  workouts: AdminWorkoutsAnalytics;
  templates: AdminTemplatesAnalytics;
  nutrition: AdminNutritionAnalytics;
  health: AdminHealthAnalytics;
  weight: AdminWeightAnalytics;
  achievements: AdminAchievementsAnalytics;
};

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

function UsersView({ data }: { data: AdminUsersAnalytics }) {
  return (
    <Stack spacing={3}>
      <StatGrid
        items={[
          { label: "Total users", value: data.totals.total },
          { label: "Active users", value: data.totals.active },
          { label: "Inactive users", value: data.totals.inactive },
          { label: "New users", value: data.totals.newInPeriod },
        ]}
      />
      <AdminAnalyticsChart
        title="User registration and activity"
        data={data.series}
        series={[
          { key: "newUsers", label: "New users", color: colors.primary },
          { key: "activeUsers", label: "Active users", color: colors.success },
          { key: "totalUsers", label: "Total growth", color: colors.secondary },
        ]}
      />
      <Typography variant="caption" color="text.secondary">
        Activity before{" "}
        {new Date(data.historyApproximateBefore).toLocaleDateString()} is based
        on the best available historical user timestamp.
      </Typography>
    </Stack>
  );
}

function WorkoutsView({ data }: { data: AdminWorkoutsAnalytics }) {
  return (
    <Stack spacing={3}>
      <StatGrid
        items={[
          { label: "Total workouts", value: data.totals.total },
          { label: "Completed", value: data.totals.completed },
          { label: "Incomplete", value: data.totals.incomplete },
          { label: "Created in period", value: data.totals.createdInPeriod },
          {
            label: "Average per active user",
            value: data.totals.averagePerActiveUser,
          },
          { label: "Duration", value: `${data.totals.durationM} min` },
          { label: "Calories burned", value: data.totals.caloriesBurned },
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

function TemplatesView({ data }: { data: AdminTemplatesAnalytics }) {
  return (
    <Stack spacing={3}>
      <StatGrid
        items={[
          { label: "Total templates", value: data.totals.total },
          { label: "Public", value: data.totals.public },
          { label: "Private", value: data.totals.private },
          { label: "Unlisted", value: data.totals.unlisted },
          { label: "Active", value: data.totals.active },
          { label: "Archived", value: data.totals.archived },
          { label: "Created in period", value: data.totals.createdInPeriod },
          {
            label: "Uses / copies",
            value: `${data.totals.usesInPeriod} / ${data.totals.copiesInPeriod}`,
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
          gridTemplateColumns: { xs: "1fr", md: "repeat(3,1fr)" },
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

function NutritionView({ data }: { data: AdminNutritionAnalytics }) {
  return (
    <Stack spacing={3}>
      <StatGrid
        items={[
          { label: "Total entries", value: data.totals.total },
          { label: "Entries in period", value: data.totals.entriesInPeriod },
          {
            label: "Participating users",
            value: data.totals.participatingUsers,
          },
          {
            label: "Average per participant",
            value: data.totals.averagePerParticipant,
          },
        ]}
      />
      <AdminAnalyticsChart
        title="Nutrition logging activity"
        data={data.series}
        variant="bar"
        series={[{ key: "entries", label: "Entries", color: colors.primary }]}
      />
      <Typography color="text.secondary">
        Only aggregate entry counts are shown. Meal names, calories, macros, and
        individual records remain private.
      </Typography>
    </Stack>
  );
}

function HealthView({ data }: { data: AdminHealthAnalytics }) {
  return (
    <Stack spacing={3}>
      <StatGrid
        items={[
          { label: "Total injuries", value: data.totals.totalInjuries },
          { label: "Active injuries", value: data.totals.active },
          { label: "Recovered", value: data.totals.recovered },
          { label: "Added in period", value: data.totals.addedInPeriod },
          {
            label: "Users with active injuries",
            value: data.totals.usersWithActiveInjuries,
          },
        ]}
      />
      <AdminAnalyticsChart
        title="Aggregate injury activity"
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
      <Typography color="text.secondary">
        No injury names, medical notes, clinician guidance, or user identities
        are available in analytics.
      </Typography>
    </Stack>
  );
}

function WeightView({ data }: { data: AdminWeightAnalytics }) {
  return (
    <Stack spacing={3}>
      <StatGrid
        items={[
          { label: "Total check-ins", value: data.totals.total },
          { label: "Check-ins in period", value: data.totals.entriesInPeriod },
          {
            label: "Participating users",
            value: data.totals.participatingUsers,
          },
          {
            label: "Average per participant",
            value: data.totals.averagePerParticipant,
          },
        ]}
      />
      <AdminAnalyticsChart
        title="Weight check-in activity"
        data={data.series}
        variant="bar"
        series={[
          { key: "checkIns", label: "Check-ins", color: colors.secondary },
        ]}
      />
      <Typography color="text.secondary">
        Individual weights and weight histories remain private.
      </Typography>
    </Stack>
  );
}

function AchievementsView({ data }: { data: AdminAchievementsAnalytics }) {
  return (
    <Stack spacing={3}>
      <StatGrid
        items={[
          { label: "Total awards", value: data.totals.totalAwarded },
          { label: "Awards in period", value: data.totals.awardedInPeriod },
          { label: "Unique recipients", value: data.totals.uniqueUsers },
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

export default function SystemAdminDashboard() {
  const router = useRouter();
  const customDefaults = useMemo(() => defaultCustomDates(), []);
  const tab =
    typeof router.query.tab === "string" &&
    tabs.includes(router.query.tab as DashboardTab)
      ? (router.query.tab as DashboardTab)
      : "overview";
  const range =
    typeof router.query.range === "string" &&
    rangeOptions.some(([value]) => value === router.query.range)
      ? (router.query.range as AdminAnalyticsRange)
      : "LAST_30_DAYS";
  const groupBy =
    typeof router.query.groupBy === "string" &&
    groupingOptions.some(([value]) => value === router.query.groupBy)
      ? (router.query.groupBy as AdminAnalyticsGrouping)
      : "AUTO";
  const custom = useMemo(
    () => ({
      start:
        typeof router.query.start === "string"
          ? router.query.start
          : customDefaults.start,
      end:
        typeof router.query.end === "string"
          ? router.query.end
          : customDefaults.end,
    }),
    [router.query.start, router.query.end, customDefaults],
  );
  const [summaryState, setSummaryState] = useState<{
    key: string;
    data: AdminSummaryAnalytics | null;
    error: string;
  }>({ key: "", data: null, error: "" });
  const [domainState, setDomainState] = useState<
    Partial<
      Record<
        DomainTab,
        { key: string; data: DomainData[DomainTab] | null; error: string }
      >
    >
  >({});
  const [refresh, setRefresh] = useState(0);

  const query = useMemo<AdminAnalyticsQuery>(
    () => ({
      range,
      groupBy,
      ...(range === "CUSTOM" ? custom : {}),
    }),
    [range, groupBy, custom],
  );
  const queryKey = JSON.stringify(query);
  const requestKey = `${queryKey}:${refresh}`;
  const queryReady =
    router.isReady &&
    (range !== "CUSTOM" || Boolean(custom.start && custom.end));

  const updateUrl = useCallback(
    (next: {
      tab?: DashboardTab;
      range?: AdminAnalyticsRange;
      groupBy?: AdminAnalyticsGrouping;
      start?: string;
      end?: string;
    }) => {
      const nextTab = next.tab ?? tab;
      const nextRange = next.range ?? range;
      const nextGrouping = next.groupBy ?? groupBy;
      const nextStart = next.start ?? custom.start;
      const nextEnd = next.end ?? custom.end;
      void router.replace(
        {
          pathname: "/system-admin",
          query: {
            tab: nextTab,
            range: nextRange,
            groupBy: nextGrouping,
            ...(nextRange === "CUSTOM"
              ? { start: nextStart, end: nextEnd }
              : {}),
          },
        },
        undefined,
        { shallow: true },
      );
    },
    [router, tab, range, groupBy, custom],
  );

  useEffect(() => {
    if (!queryReady) return;
    let active = true;
    getAdminDashboardSummary(query)
      .then((data) => {
        if (active) setSummaryState({ key: requestKey, data, error: "" });
      })
      .catch((error) => {
        if (active)
          setSummaryState({
            key: requestKey,
            data: null,
            error: errorMessage(error),
          });
      });
    return () => {
      active = false;
    };
  }, [requestKey, queryReady]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!queryReady || tab === "overview") return;
    let active = true;
    const selected = tab;
    const loaders: {
      [K in DomainTab]: (value: AdminAnalyticsQuery) => Promise<DomainData[K]>;
    } = {
      users: getAdminUsersAnalytics,
      workouts: getAdminWorkoutsAnalytics,
      templates: getAdminTemplatesAnalytics,
      nutrition: getAdminNutritionAnalytics,
      health: getAdminHealthAnalytics,
      weight: getAdminWeightAnalytics,
      achievements: getAdminAchievementsAnalytics,
    };
    loaders[selected](query)
      .then((data) => {
        if (active)
          setDomainState((values) => ({
            ...values,
            [selected]: { key: requestKey, data, error: "" },
          }));
      })
      .catch((error) => {
        if (active)
          setDomainState((values) => ({
            ...values,
            [selected]: {
              key: requestKey,
              data: null,
              error: errorMessage(error),
            },
          }));
      });
    return () => {
      active = false;
    };
  }, [tab, requestKey, queryReady]); // eslint-disable-line react-hooks/exhaustive-deps

  const setDashboardTab = (value: DashboardTab) => updateUrl({ tab: value });
  const renderDomain = () => {
    if (tab === "overview") return null;
    const state = domainState[tab];
    if (state?.key === requestKey && state.error)
      return (
        <AnalyticsError
          message={state.error}
          retry={() => setRefresh((value) => value + 1)}
        />
      );
    if (state?.key !== requestKey || !state.data) return <AnalyticsLoading />;
    if (tab === "users")
      return <UsersView data={state.data as AdminUsersAnalytics} />;
    if (tab === "workouts")
      return <WorkoutsView data={state.data as AdminWorkoutsAnalytics} />;
    if (tab === "templates")
      return <TemplatesView data={state.data as AdminTemplatesAnalytics} />;
    if (tab === "nutrition")
      return <NutritionView data={state.data as AdminNutritionAnalytics} />;
    if (tab === "health")
      return <HealthView data={state.data as AdminHealthAnalytics} />;
    if (tab === "weight")
      return <WeightView data={state.data as AdminWeightAnalytics} />;
    return <AchievementsView data={state.data as AdminAchievementsAnalytics} />;
  };

  const summary = summaryState.key === requestKey ? summaryState.data : null;
  const summaryError =
    summaryState.key === requestKey ? summaryState.error : "";

  return (
    <AdminPageGuard>
      <AdminLayout>
        <Box sx={{ py: 4 }}>
          <Container maxWidth="xl">
            <Stack spacing={3}>
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  Admin analytics
                </Typography>
                <Typography color="text.secondary">
                  System-wide activity and content insights without exposing
                  private user records.
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
                      updateUrl({
                        range: event.target.value as AdminAnalyticsRange,
                      })
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
                        value={custom.start}
                        InputLabelProps={{ shrink: true }}
                        onChange={(event) =>
                          updateUrl({ start: event.target.value })
                        }
                      />
                      <TextField
                        size="small"
                        type="date"
                        label="End"
                        value={custom.end}
                        InputLabelProps={{ shrink: true }}
                        onChange={(event) =>
                          updateUrl({ end: event.target.value })
                        }
                      />
                    </>
                  )}
                  <TextField
                    select
                    size="small"
                    label="Chart grouping"
                    value={groupBy}
                    onChange={(event) =>
                      updateUrl({
                        groupBy: event.target.value as AdminAnalyticsGrouping,
                      })
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
                    Timezone: {summary?.metadata.timezone ?? "Loading…"}
                  </Typography>
                </Stack>
              </Paper>
              <TextField
                select
                size="small"
                label="Analytics section"
                value={tab}
                onChange={(event) =>
                  setDashboardTab(event.target.value as DashboardTab)
                }
                sx={{ display: { xs: "block", md: "none" } }}
              >
                {tabs.map((value) => (
                  <MenuItem key={value} value={value}>
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
              <Tabs
                value={tab}
                onChange={(_, value: DashboardTab) => setDashboardTab(value)}
                variant="fullWidth"
                aria-label="Admin analytics sections"
                sx={{ display: { xs: "none", md: "flex" }, maxWidth: "100%" }}
              >
                {tabs.map((value) => (
                  <Tab
                    key={value}
                    value={value}
                    label={value.charAt(0).toUpperCase() + value.slice(1)}
                    sx={{ minWidth: 0 }}
                  />
                ))}
              </Tabs>
              {summaryError ? (
                <AnalyticsError
                  message={summaryError}
                  retry={() => setRefresh((value) => value + 1)}
                />
              ) : !summary ? (
                <AnalyticsLoading />
              ) : tab === "overview" ? (
                <Stack spacing={3}>
                  <StatGrid
                    items={[
                      {
                        label: "Users",
                        value: summary.users.total,
                        helper: `${summary.users.active} active · ${summary.users.newInPeriod} new`,
                      },
                      {
                        label: "Workouts",
                        value: summary.workouts.total,
                        helper: `${summary.workouts.completed} completed · ${summary.workouts.createdInPeriod} new`,
                      },
                      {
                        label: "Templates",
                        value: summary.templates.total,
                        helper: `${summary.templates.public} public · ${summary.templates.archived} archived`,
                      },
                      {
                        label: "Nutrition entries",
                        value: summary.nutrition.total,
                        helper: `${summary.nutrition.entriesInPeriod} in period`,
                      },
                      {
                        label: "Injuries",
                        value: summary.health.totalInjuries,
                        helper: `${summary.health.active} active · ${summary.health.recovered} recovered`,
                      },
                      {
                        label: "Weight check-ins",
                        value: summary.weight.total,
                        helper: `${summary.weight.entriesInPeriod} in period`,
                      },
                      {
                        label: "Achievement awards",
                        value: summary.achievements.totalAwarded,
                        helper: `${summary.achievements.awardedInPeriod} in period`,
                      },
                      { label: "Exercises", value: summary.totalExercises },
                    ]}
                  />
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" mb={2}>
                      Management
                    </Typography>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                      <Button
                        variant="outlined"
                        onClick={() => router.push("/system-admin/users")}
                      >
                        Manage users
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => router.push("/system-admin/exercises")}
                      >
                        Manage exercises
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => router.push("/system-admin/templates")}
                      >
                        Manage templates
                      </Button>
                    </Stack>
                  </Paper>
                </Stack>
              ) : (
                renderDomain()
              )}
            </Stack>
          </Container>
        </Box>
      </AdminLayout>
    </AdminPageGuard>
  );
}
