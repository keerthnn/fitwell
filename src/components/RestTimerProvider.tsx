import { Add, Close, Pause, PlayArrow, Replay } from "@mui/icons-material";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type State = {
  duration: number;
  remaining: number;
  running: boolean;
  startedAt: number | null;
};
type TimerContext = State & {
  start(seconds: number): void;
  pause(): void;
  resume(): void;
  add(seconds: number): void;
  reset(): void;
  stop(): void;
};
const initial: State = {
  duration: 0,
  remaining: 0,
  running: false,
  startedAt: null,
};
const Context = createContext<TimerContext | null>(null);

export function useRestTimer() {
  const value = useContext(Context);
  if (!value)
    throw new Error("useRestTimer must be used inside RestTimerProvider");
  return value;
}

export default function RestTimerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<State>(initial);
  useEffect(() => {
    const id = window.setTimeout(() => {
      const stored = localStorage.getItem("fitwell.restTimer");
      if (stored) {
        try {
          setState(JSON.parse(stored));
        } catch {}
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, []);
  useEffect(() => {
    localStorage.setItem("fitwell.restTimer", JSON.stringify(state));
  }, [state]);
  useEffect(() => {
    if (!state.running) return;
    const tick = () =>
      setState((current) => {
        if (!current.running || !current.startedAt) return current;
        const remaining = Math.max(
          0,
          current.duration -
            Math.floor((Date.now() - current.startedAt) / 1000),
        );
        return remaining === 0 ? initial : { ...current, remaining };
      });
    tick();
    const id = window.setInterval(tick, 500);
    return () => window.clearInterval(id);
  }, [state.running, state.startedAt, state.duration]);
  const start = useCallback(
    (seconds: number) =>
      setState({
        duration: seconds,
        remaining: seconds,
        running: true,
        startedAt: Date.now(),
      }),
    [],
  );
  const pause = useCallback(
    () =>
      setState((s) => ({
        ...s,
        duration: s.remaining,
        running: false,
        startedAt: null,
      })),
    [],
  );
  const resume = useCallback(
    () =>
      setState((s) => ({
        ...s,
        running: true,
        startedAt: Date.now(),
        duration: s.remaining,
      })),
    [],
  );
  const add = useCallback(
    (seconds: number) =>
      setState((s) => ({
        ...s,
        duration: s.duration + seconds,
        remaining: s.remaining + seconds,
      })),
    [],
  );
  const stop = useCallback(() => setState(initial), []);
  const reset = useCallback(
    () =>
      setState((current) => ({
        ...current,
        remaining: current.duration,
        running: true,
        startedAt: Date.now(),
      })),
    [],
  );
  const value = useMemo(
    () => ({ ...state, start, pause, resume, add, reset, stop }),
    [state, start, pause, resume, add, reset, stop],
  );
  return (
    <Context.Provider value={value}>
      {children}
      {state.remaining > 0 && (
        <Paper
          elevation={6}
          sx={{
            position: "fixed",
            zIndex: 1400,
            right: { xs: 8, md: 16 },
            left: { xs: 8, md: "auto" },
            bottom: {
              xs: "calc(80px + env(safe-area-inset-bottom))",
              md: 16,
            },
            p: 2,
            borderRadius: 3,
            maxWidth: { md: 560 },
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            flexWrap="wrap"
          >
            <Box>
              <Typography variant="caption">Rest timer</Typography>
              <Typography variant="h6">
                {Math.floor(state.remaining / 60)}:
                {String(state.remaining % 60).padStart(2, "0")}
              </Typography>
            </Box>
            <Button
              size="small"
              onClick={state.running ? pause : resume}
              startIcon={state.running ? <Pause /> : <PlayArrow />}
              sx={{ minHeight: 44 }}
            >
              {state.running ? "Pause" : "Resume"}
            </Button>
            <Button
              size="small"
              onClick={() => add(30)}
              startIcon={<Add />}
              sx={{ minHeight: 44 }}
            >
              30s
            </Button>
            <Button
              size="small"
              onClick={reset}
              startIcon={<Replay />}
              sx={{ minHeight: 44 }}
            >
              Reset
            </Button>
            <Button
              size="small"
              color="inherit"
              onClick={stop}
              startIcon={<Close />}
              sx={{ minHeight: 44 }}
            >
              Dismiss
            </Button>
          </Stack>
        </Paper>
      )}
    </Context.Provider>
  );
}
