import { Box, Stack, Typography } from "@mui/material";
import { listCalendarDateKeys } from "fitness/lib/workouts/activityCalendar";
import type { WorkoutActivityCalendarResponse } from "fitness/utils/types";
import { useEffect, useMemo, useRef } from "react";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function dateFromKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function formatDate(dateKey: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateFromKey(dateKey));
}

function monthLabel(dateKey: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "short",
  }).format(dateFromKey(dateKey));
}

export default function WorkoutActivityCalendar({
  data,
}: {
  data: WorkoutActivityCalendarResponse;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dates = useMemo(
    () => listCalendarDateKeys(data.startDate, data.endDate),
    [data.endDate, data.startDate],
  );
  const completedDates = useMemo(
    () => new Set(data.completedDates),
    [data.completedDates],
  );
  const weeks = useMemo(
    () => Array.from({ length: 53 }, (_, index) => dates.slice(index * 7, index * 7 + 7)),
    [dates],
  );

  useEffect(() => {
    const scroll = scrollRef.current;
    if (scroll) scroll.scrollLeft = scroll.scrollWidth;
  }, [data.endDate]);

  return (
    <Stack gap={1.5}>
      <Box>
        <Typography variant="h6">Workout activity</Typography>
        <Typography variant="body2" color="text.secondary">
          Your completed workouts over the last 53 weeks.
        </Typography>
      </Box>

      {completedDates.size === 0 && (
        <Typography variant="body2" color="text.secondary">
          No completed workouts in this period.
        </Typography>
      )}

      <Box
        ref={scrollRef}
        data-testid="workout-activity-scroll"
        sx={{
          maxWidth: "100%",
          overflowX: "auto",
          pb: 1,
          WebkitOverflowScrolling: "touch",
        }}
      >
        <Box
          role="grid"
          aria-label="Workout activity calendar"
          sx={{ minWidth: 800, width: "max-content" }}
        >
          <Box
            aria-hidden="true"
            sx={{
              display: "grid",
              gridTemplateColumns: "36px repeat(53, 12px)",
              columnGap: "3px",
              minHeight: 20,
              mb: 0.5,
            }}
          >
            <Box />
            {weeks.map((week, index) => {
              const label =
                index === 0 ||
                dateFromKey(week[0]).getUTCMonth() !==
                  dateFromKey(weeks[index - 1][0]).getUTCMonth()
                  ? monthLabel(week[0])
                  : "";
              return (
                <Typography
                  key={week[0]}
                  variant="caption"
                  color="text.secondary"
                  sx={{ whiteSpace: "nowrap", overflow: "visible" }}
                >
                  {label}
                </Typography>
              );
            })}
          </Box>

          <Box sx={{ display: "flex", gap: "6px" }}>
            <Box
              aria-hidden="true"
              sx={{
                width: 30,
                display: "grid",
                gridTemplateRows: "repeat(7, 12px)",
                rowGap: "3px",
                flexShrink: 0,
              }}
            >
              {WEEKDAYS.map((day) => (
                <Typography
                  key={day}
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: 9, lineHeight: "12px" }}
                >
                  {day}
                </Typography>
              ))}
            </Box>

            <Box
              sx={{
                display: "grid",
                gridAutoFlow: "column",
                gridTemplateRows: "repeat(7, 12px)",
                gridTemplateColumns: "repeat(53, 12px)",
                gap: "3px",
              }}
            >
              {dates.map((dateKey) => {
                const future = dateKey > data.todayDate;
                const completed = completedDates.has(dateKey);
                const state = future
                  ? "future date unavailable"
                  : completed
                    ? "workout completed"
                    : "no completed workout";
                return (
                  <Box
                    key={dateKey}
                    role="gridcell"
                    aria-label={`${formatDate(dateKey)}: ${state}`}
                    aria-disabled={future || undefined}
                    title={`${formatDate(dateKey)} — ${state}`}
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "3px",
                      border: "1px solid",
                      borderColor: completed ? "success.dark" : "divider",
                      bgcolor: completed
                        ? "success.main"
                        : "action.disabledBackground",
                      color: "success.contrastText",
                      fontSize: 8,
                      lineHeight: "10px",
                      textAlign: "center",
                      opacity: future ? 0.45 : 1,
                    }}
                  >
                    {completed ? "✓" : ""}
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Box>

      <Stack direction="row" gap={2} flexWrap="wrap" aria-label="Activity legend">
        <Stack direction="row" gap={0.75} alignItems="center">
          <Box
            aria-hidden="true"
            sx={{
              width: 12,
              height: 12,
              borderRadius: "3px",
              bgcolor: "success.main",
              color: "success.contrastText",
              fontSize: 8,
              lineHeight: "12px",
              textAlign: "center",
            }}
          >
            ✓
          </Box>
          <Typography variant="caption">Workout completed</Typography>
        </Stack>
        <Stack direction="row" gap={0.75} alignItems="center">
          <Box
            aria-hidden="true"
            sx={{
              width: 12,
              height: 12,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "3px",
              bgcolor: "action.disabledBackground",
            }}
          />
          <Typography variant="caption">No completed workout</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
