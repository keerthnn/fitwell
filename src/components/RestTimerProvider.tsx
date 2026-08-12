import {
  Add,
  CircleCheckFilled,
  Close,
  Pause,
  PlayArrow,
  Replay,
  Stopwatch,
} from "fitness/components/common/icons";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useAuth } from "fitness/components/context";
import {
  addRestTimerSeconds,
  createRestTimer,
  formatRestTime,
  hydrateRestTimer,
  isRestTimerSurfaceVisible,
  pauseRestTimer,
  reconcileRestTimer,
  resetRestTimer,
  REST_TIMER_COMPLETE_CUE_MS,
  REST_TIMER_STORAGE_KEY,
  type RestTimer,
  resumeRestTimer,
  serializeRestTimer,
} from "fitness/utils/restTimer";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type VisibleRestTimer = RestTimer & {
  running: boolean;
  paused: boolean;
};

export type RestTimerContextValue = {
  timer: VisibleRestTimer | null;
  remainingSeconds: number;
  start(workoutId: string, seconds: number): void;
  pause(): void;
  resume(): void;
  add(seconds: number): void;
  reset(): void;
  skip(): void;
  stop(): void;
  pauseForWorkout(workoutId: string): void;
  resumeForWorkout(workoutId: string): void;
  clearForWorkout(workoutId: string): void;
  completionVisible: boolean;
};

type ProviderState = {
  timer: RestTimer | null;
  completionWorkoutId: string | null;
};

const EMPTY_STATE: ProviderState = {
  timer: null,
  completionWorkoutId: null,
};

const Context = createContext<RestTimerContextValue | null>(null);

export function useRestTimer() {
  const value = useContext(Context);
  if (!value) {
    throw new Error("useRestTimer must be used inside RestTimerProvider");
  }
  return value;
}

function safelyRemoveStoredTimer() {
  try {
    window.localStorage.removeItem(REST_TIMER_STORAGE_KEY);
  } catch {
    // Storage can be unavailable in restricted browser contexts.
  }
}

export default function RestTimerProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const userId = loading ? null : (user?.uid ?? null);
  const sessionKey = loading
    ? "loading"
    : userId
      ? `user:${userId}`
      : "signed-out";

  return (
    <RestTimerSession
      key={sessionKey}
      userId={userId}
      loading={loading}
    >
      {children}
    </RestTimerSession>
  );
}

function RestTimerSession({
  children,
  userId,
  loading,
}: {
  children: ReactNode;
  userId: string | null;
  loading: boolean;
}) {
  const [hydratedUserId, setHydratedUserId] = useState<string | null>(null);
  const [state, setState] = useState<ProviderState>(EMPTY_STATE);
  const ready = !loading && userId !== null && hydratedUserId === userId;

  useEffect(() => {
    if (loading) return;
    if (!userId) {
      safelyRemoveStoredTimer();
      return;
    }

    const timeoutId = window.setTimeout(() => {
      let stored: string | null = null;
      try {
        stored = window.localStorage.getItem(REST_TIMER_STORAGE_KEY);
      } catch {
        // Treat unavailable storage like an empty store.
      }

      const timer = stored
        ? hydrateRestTimer(stored, userId, Date.now())
        : null;
      if (stored && !timer) safelyRemoveStoredTimer();
      setState({ timer, completionWorkoutId: null });
      setHydratedUserId(userId);
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [loading, userId]);

  useEffect(() => {
    if (!ready || !userId) return;
    try {
      if (state.timer) {
        window.localStorage.setItem(
          REST_TIMER_STORAGE_KEY,
          serializeRestTimer(state.timer, userId),
        );
      } else {
        window.localStorage.removeItem(REST_TIMER_STORAGE_KEY);
      }
    } catch {
      // The timer remains usable for this tab when persistence is unavailable.
    }
  }, [ready, state.timer, userId]);

  const visibleTimer = ready ? state.timer : null;
  const tickingWorkoutId =
    visibleTimer?.status === "running" ? visibleTimer.workoutId : null;
  const tickingDeadlineMs =
    visibleTimer?.status === "running" ? visibleTimer.deadlineMs : null;

  useEffect(() => {
    if (!tickingWorkoutId || tickingDeadlineMs === null) return;

    const workoutId = tickingWorkoutId;
    const deadlineMs = tickingDeadlineMs;
    const tick = () => {
      setState((current) => {
        const timer = current.timer;
        if (
          !timer ||
          timer.workoutId !== workoutId ||
          timer.status !== "running" ||
          timer.deadlineMs !== deadlineMs
        ) {
          return current;
        }

        const reconciled = reconcileRestTimer(timer, Date.now());
        if (!reconciled) {
          return { timer: null, completionWorkoutId: workoutId };
        }
        if (reconciled === timer) return current;
        return { ...current, timer: reconciled };
      });
    };

    tick();
    const intervalId = window.setInterval(tick, 250);
    const handleVisibilityChange = () => {
      if (!document.hidden) tick();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [tickingDeadlineMs, tickingWorkoutId]);

  useEffect(() => {
    const completedWorkoutId = state.completionWorkoutId;
    if (!completedWorkoutId) return;
    const timeoutId = window.setTimeout(() => {
      setState((current) =>
        current.completionWorkoutId === completedWorkoutId
          ? { ...current, completionWorkoutId: null }
          : current,
      );
    }, REST_TIMER_COMPLETE_CUE_MS);
    return () => window.clearTimeout(timeoutId);
  }, [state.completionWorkoutId]);

  const start = useCallback(
    (workoutId: string, seconds: number) => {
      if (!ready) return;
      const nextTimer = createRestTimer(workoutId, seconds, Date.now());
      setState((current) => {
        if (nextTimer) {
          return { timer: nextTimer, completionWorkoutId: null };
        }
        const timerMatches = current.timer?.workoutId === workoutId;
        const cueMatches = current.completionWorkoutId === workoutId;
        if (!timerMatches && !cueMatches) return current;
        return {
          timer: timerMatches ? null : current.timer,
          completionWorkoutId: cueMatches
            ? null
            : current.completionWorkoutId,
        };
      });
    },
    [ready],
  );

  const pause = useCallback(() => {
    if (!ready) return;
    setState((current) => {
      if (!current.timer) return current;
      const nextTimer = pauseRestTimer(current.timer, "manual", Date.now());
      return nextTimer
        ? { ...current, timer: nextTimer }
        : { timer: null, completionWorkoutId: current.timer.workoutId };
    });
  }, [ready]);

  const resume = useCallback(() => {
    if (!ready) return;
    setState((current) =>
      current.timer
        ? {
            ...current,
            timer: resumeRestTimer(current.timer, "manual", Date.now()),
          }
        : current,
    );
  }, [ready]);

  const add = useCallback(
    (seconds: number) => {
      if (!ready) return;
      setState((current) => {
        if (!current.timer) return current;
        const nextTimer = addRestTimerSeconds(
          current.timer,
          seconds,
          Date.now(),
        );
        return nextTimer
          ? { ...current, timer: nextTimer }
          : { timer: null, completionWorkoutId: current.timer.workoutId };
      });
    },
    [ready],
  );

  const reset = useCallback(() => {
    if (!ready) return;
    setState((current) =>
      current.timer
        ? {
            timer: resetRestTimer(current.timer, Date.now()),
            completionWorkoutId: null,
          }
        : current,
    );
  }, [ready]);

  const skip = useCallback(() => {
    if (!ready) return;
    setState(EMPTY_STATE);
  }, [ready]);

  const pauseForWorkout = useCallback(
    (workoutId: string) => {
      if (!ready) return;
      setState((current) => {
        if (current.timer?.workoutId !== workoutId) return current;
        const nextTimer = pauseRestTimer(current.timer, "workout", Date.now());
        return nextTimer
          ? { ...current, timer: nextTimer }
          : { timer: null, completionWorkoutId: workoutId };
      });
    },
    [ready],
  );

  const resumeForWorkout = useCallback(
    (workoutId: string) => {
      if (!ready) return;
      setState((current) =>
        current.timer?.workoutId === workoutId
          ? {
              ...current,
              timer: resumeRestTimer(current.timer, "workout", Date.now()),
            }
          : current,
      );
    },
    [ready],
  );

  const clearForWorkout = useCallback(
    (workoutId: string) => {
      if (!ready) return;
      setState((current) => {
        const timerMatches = current.timer?.workoutId === workoutId;
        const cueMatches = current.completionWorkoutId === workoutId;
        if (!timerMatches && !cueMatches) return current;
        return {
          timer: timerMatches ? null : current.timer,
          completionWorkoutId: cueMatches
            ? null
            : current.completionWorkoutId,
        };
      });
    },
    [ready],
  );

  const publicTimer = useMemo<VisibleRestTimer | null>(
    () =>
      visibleTimer
        ? {
            ...visibleTimer,
            running: visibleTimer.status === "running",
            paused: visibleTimer.status === "paused",
          }
        : null,
    [visibleTimer],
  );

  const value = useMemo<RestTimerContextValue>(
    () => ({
      timer: publicTimer,
      remainingSeconds: publicTimer?.remainingSeconds ?? 0,
      start,
      pause,
      resume,
      add,
      reset,
      skip,
      stop: skip,
      pauseForWorkout,
      resumeForWorkout,
      clearForWorkout,
      completionVisible: ready && state.completionWorkoutId !== null,
    }),
    [
      add,
      clearForWorkout,
      pause,
      pauseForWorkout,
      publicTimer,
      ready,
      reset,
      resume,
      resumeForWorkout,
      skip,
      start,
      state.completionWorkoutId,
    ],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function RestTimerSurface({
  onHeightChange,
}: {
  onHeightChange?: (height: number) => void;
}) {
  const {
    timer,
    remainingSeconds,
    pause,
    resume,
    add,
    reset,
    skip,
    completionVisible,
  } = useRestTimer();
  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const lastHeightRef = useRef(-1);
  const visible = isRestTimerSurfaceVisible(timer, completionVisible);

  const reportHeight = useCallback(
    (height: number) => {
      const roundedHeight = Math.ceil(height);
      if (lastHeightRef.current === roundedHeight) return;
      lastHeightRef.current = roundedHeight;
      onHeightChange?.(roundedHeight);
    },
    [onHeightChange],
  );

  useEffect(() => {
    if (!visible) {
      reportHeight(0);
      return;
    }
    const surface = surfaceRef.current;
    if (!surface) return;

    const measure = () => reportHeight(surface.getBoundingClientRect().height);
    measure();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }

    const observer = new ResizeObserver(measure);
    observer.observe(surface);
    return () => observer.disconnect();
  }, [completionVisible, reportHeight, timer?.status, visible]);

  if (!visible) return null;

  const pausedForWorkout = timer?.pauseReason === "workout";
  return (
    <Paper
      ref={surfaceRef}
      role={completionVisible ? "status" : undefined}
      aria-live={completionVisible ? "polite" : undefined}
      aria-atomic={completionVisible ? "true" : undefined}
      elevation={6}
      sx={{
        position: "fixed",
        zIndex: (theme) => theme.zIndex.drawer - 1,
        right: { xs: 16, md: 16 },
        left: { xs: 16, md: "auto" },
        bottom: (theme) => ({
          xs: `calc(${theme.fitwell.mobileNavigationHeight + 8}px + env(safe-area-inset-bottom))`,
          md: 16,
        }),
        width: { md: "fit-content" },
        maxWidth: 620,
        mx: { xs: "auto", md: 0 },
        p: 1.5,
        borderRadius: 3,
        bgcolor: (theme) => theme.fitwell.colors.semantic.warning.container,
        color: (theme) => theme.fitwell.colors.semantic.warning.onContainer,
        border: "1px solid",
        borderColor: "warning.main",
        animation: completionVisible
          ? "restTimerCompletePulse 700ms ease-in-out 2"
          : "none",
        "@keyframes restTimerCompletePulse": {
          "0%, 100%": { transform: "scale(1)", opacity: 1 },
          "50%": { transform: "scale(1.025)", opacity: 0.78 },
        },
        "@media (prefers-reduced-motion: reduce)": {
          animation: "none",
        },
        "& .MuiButton-root:focus-visible": {
          outlineColor: "currentColor",
        },
      }}
    >
      {completionVisible ? (
        <Stack direction="row" alignItems="center" gap={1}>
          <CircleCheckFilled fontSize="large" />
          <Typography variant="h6">Rest complete</Typography>
        </Stack>
      ) : timer ? (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "stretch", sm: "center" }}
          gap={1}
        >
          <Stopwatch
            sx={{
              display: { xs: "none", sm: "block" },
              fontSize: 32,
              mr: 0.25,
            }}
          />
          <Box sx={{ minWidth: 104, mr: { sm: 0.5 } }}>
            <Typography variant="caption">
              {timer.status === "running"
                ? "Rest timer"
                : pausedForWorkout
                  ? "Paused with workout"
                  : "Rest timer paused"}
            </Typography>
            <Typography
              variant="h6"
              aria-label={`${remainingSeconds} seconds remaining`}
            >
              {formatRestTime(remainingSeconds)}
            </Typography>
          </Box>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            <Button
              size="small"
              variant="outlined"
              color="inherit"
              disabled={pausedForWorkout}
              onClick={timer.status === "running" ? pause : resume}
              startIcon={timer.status === "running" ? <Pause /> : <PlayArrow />}
              sx={{ minHeight: 44 }}
            >
              {timer.status === "running" ? "Pause" : "Resume"}
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="inherit"
              onClick={() => add(30)}
              startIcon={<Add />}
              sx={{ minHeight: 44 }}
            >
              +30s
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="inherit"
              onClick={reset}
              startIcon={<Replay />}
              sx={{ minHeight: 44 }}
            >
              Reset
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="inherit"
              onClick={skip}
              startIcon={<Close />}
              sx={{ minHeight: 44 }}
            >
              Skip rest
            </Button>
          </Stack>
        </Stack>
      ) : null}
    </Paper>
  );
}
