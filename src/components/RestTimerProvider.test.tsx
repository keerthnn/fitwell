// @vitest-environment jsdom

import { ThemeProvider } from "@mui/material/styles";
import "@testing-library/jest-dom/vitest";
import { act, cleanup, renderHook, screen } from "@testing-library/react";
import createAppTheme from "fitness/theme";
import {
  createRestTimer,
  REST_TIMER_COMPLETE_CUE_MS,
  REST_TIMER_STORAGE_KEY,
  serializeRestTimer,
} from "fitness/utils/restTimer";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import RestTimerProvider, {
  RestTimerSurface,
  useRestTimer,
} from "./RestTimerProvider";

const NOW = 1_800_000_000_000;
const authState = vi.hoisted(() => ({
  current: {
    user: { uid: "user-1" } as { uid: string } | null,
    loading: false,
  },
}));

vi.mock("fitness/components/context", () => ({
  useAuth: () => authState.current,
}));

function wrapper({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={createAppTheme("light")}>
      <RestTimerProvider>
        {children}
        <RestTimerSurface />
      </RestTimerProvider>
    </ThemeProvider>
  );
}

async function hydrateProvider() {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(0);
  });
}

describe("RestTimerProvider", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    window.localStorage.clear();
    authState.current = {
      user: { uid: "user-1" },
      loading: false,
    };
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("hydrates only the signed-in user's unexpired deadline", async () => {
    const storedTimer = createRestTimer("workout-1", 90, NOW)!;
    window.localStorage.setItem(
      REST_TIMER_STORAGE_KEY,
      serializeRestTimer(storedTimer, "user-1"),
    );
    vi.setSystemTime(NOW + 20_000);

    const { result } = renderHook(() => useRestTimer(), { wrapper });
    expect(result.current.timer).toBeNull();

    await hydrateProvider();

    expect(result.current.timer).toMatchObject({
      workoutId: "workout-1",
      status: "running",
      remainingSeconds: 70,
    });
    expect(screen.getByText("1:10")).toBeInTheDocument();
  });

  it("discards a different user's stored timer", async () => {
    const storedTimer = createRestTimer("workout-1", 90, NOW)!;
    window.localStorage.setItem(
      REST_TIMER_STORAGE_KEY,
      serializeRestTimer(storedTimer, "another-user"),
    );

    const { result } = renderHook(() => useRestTimer(), { wrapper });
    await hydrateProvider();

    expect(result.current.timer).toBeNull();
    expect(window.localStorage.getItem(REST_TIMER_STORAGE_KEY)).toBeNull();
  });

  it("shows one brief accessible completion cue only on live expiry", async () => {
    const { result } = renderHook(() => useRestTimer(), { wrapper });
    await hydrateProvider();

    act(() => result.current.start("workout-1", 2));
    expect(screen.getByText("0:02")).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2_000);
    });

    expect(result.current.timer).toBeNull();
    expect(screen.getByRole("status")).toHaveTextContent("Rest complete");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(REST_TIMER_COMPLETE_CUE_MS);
    });
    expect(screen.queryByText("Rest complete")).not.toBeInTheDocument();
  });

  it("replaces an active countdown and clears zero seconds silently", async () => {
    const { result } = renderHook(() => useRestTimer(), { wrapper });
    await hydrateProvider();

    act(() => result.current.start("workout-1", 90));
    act(() => result.current.start("workout-1", 60));
    expect(result.current.timer).toMatchObject({
      durationSeconds: 60,
      remainingSeconds: 60,
    });

    act(() => result.current.start("workout-1", 0));
    expect(result.current.timer).toBeNull();
    expect(screen.queryByText("Rest complete")).not.toBeInTheDocument();
  });

  it("silently skips and clears the timer on sign-out", async () => {
    const { result, rerender } = renderHook(() => useRestTimer(), { wrapper });
    await hydrateProvider();

    act(() => result.current.start("workout-1", 90));
    expect(window.localStorage.getItem(REST_TIMER_STORAGE_KEY)).not.toBeNull();

    act(() => result.current.skip());
    expect(screen.queryByText("Rest complete")).not.toBeInTheDocument();
    expect(window.localStorage.getItem(REST_TIMER_STORAGE_KEY)).toBeNull();

    act(() => result.current.start("workout-1", 90));
    authState.current = { user: null, loading: false };
    rerender();
    expect(result.current.timer).toBeNull();
    expect(window.localStorage.getItem(REST_TIMER_STORAGE_KEY)).toBeNull();
  });

  it("does not restore stale timer state when the same user signs back in", async () => {
    const { result, rerender } = renderHook(() => useRestTimer(), { wrapper });
    await hydrateProvider();

    act(() => result.current.start("workout-1", 90));
    expect(window.localStorage.getItem(REST_TIMER_STORAGE_KEY)).not.toBeNull();

    authState.current = { user: null, loading: false };
    rerender();
    authState.current = { user: { uid: "user-1" }, loading: false };
    rerender();
    await hydrateProvider();

    expect(result.current.timer).toBeNull();
    expect(window.localStorage.getItem(REST_TIMER_STORAGE_KEY)).toBeNull();
  });
});
