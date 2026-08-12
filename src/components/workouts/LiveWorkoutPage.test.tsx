// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import type { ReactNode } from "react";
import type { Workout } from "fitness/utils/types";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type TimerSnapshot = {
  workoutId: string;
  durationSeconds: number;
  status: "running" | "paused";
  pauseReason: "manual" | "workout" | null;
  deadlineMs: number | null;
  remainingSeconds: number;
};

const mocks = vi.hoisted(() => ({
  clearForWorkout: vi.fn(),
  completeWorkout: vi.fn(),
  getWorkoutById: vi.fn(),
  pauseForWorkout: vi.fn(),
  pauseWorkout: vi.fn(),
  push: vi.fn(),
  resumeForWorkout: vi.fn(),
  resumeWorkout: vi.fn(),
  start: vi.fn(),
  timer: null as TimerSnapshot | null,
}));

vi.mock("next/router", () => ({
  useRouter: () => ({ query: { id: "workout-1" }, push: mocks.push }),
}));

vi.mock("fitness/utils/spec", () => ({
  completeWorkout: mocks.completeWorkout,
  getWorkoutById: mocks.getWorkoutById,
  pauseWorkout: mocks.pauseWorkout,
  resumeWorkout: mocks.resumeWorkout,
}));

vi.mock("fitness/components/RestTimerProvider", () => ({
  useRestTimer: () => ({
    timer: mocks.timer,
    start: mocks.start,
    pauseForWorkout: mocks.pauseForWorkout,
    resumeForWorkout: mocks.resumeForWorkout,
    clearForWorkout: mocks.clearForWorkout,
  }),
}));

vi.mock("fitness/components/AuthenticatedPage", () => ({
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock("fitness/components/common/HeroSurface", () => ({
  default: ({ children }: { children: ReactNode }) => (
    <section>{children}</section>
  ),
}));

vi.mock("fitness/components/common/LoadingState", () => ({
  default: () => <div>Loading</div>,
}));

vi.mock("fitness/components/common/PageHeader", () => ({
  default: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

vi.mock("fitness/components/workouts/WorkoutExerciseEditor", () => ({
  default: ({
    disabled,
    onStartRest,
  }: {
    disabled?: boolean;
    onStartRest?: (seconds: number) => void;
  }) => (
    <button
      data-testid="exercise-editor"
      disabled={disabled}
      onClick={() => onStartRest?.(90)}
    >
      Start rest
    </button>
  ),
}));

import LiveWorkoutPage from "fitness/pages/workouts/live/[id]";

const makeWorkout = (status: Workout["status"]): Workout => ({
  id: "workout-1",
  name: "Evening workout",
  workoutDate: "2026-08-12",
  status,
  entryMode: "LIVE",
  startedAt: "2026-08-12T12:00:00.000Z",
  completedAt: null,
  durationMinutes: null,
  notes: null,
  sourceWorkoutPlanId: null,
  exercises: [],
});

beforeEach(() => {
  vi.clearAllMocks();
  mocks.timer = null;
  mocks.getWorkoutById.mockResolvedValue(makeWorkout("IN_PROGRESS"));
  mocks.pauseWorkout.mockResolvedValue(makeWorkout("DRAFT"));
  mocks.resumeWorkout.mockResolvedValue(makeWorkout("IN_PROGRESS"));
  mocks.completeWorkout.mockResolvedValue(makeWorkout("COMPLETED"));
  mocks.push.mockResolvedValue(true);

  mocks.pauseForWorkout.mockImplementation((workoutId: string) => {
    if (mocks.timer?.workoutId === workoutId) {
      mocks.timer = {
        ...mocks.timer,
        status: "paused",
        pauseReason: "workout",
        deadlineMs: null,
      };
    }
  });
  mocks.resumeForWorkout.mockImplementation((workoutId: string) => {
    if (
      mocks.timer?.workoutId === workoutId &&
      mocks.timer.pauseReason === "workout"
    ) {
      mocks.timer = {
        ...mocks.timer,
        status: "running",
        pauseReason: null,
        deadlineMs: Date.now() + mocks.timer.remainingSeconds * 1000,
      };
    }
  });
  mocks.clearForWorkout.mockImplementation((workoutId: string) => {
    if (mocks.timer?.workoutId === workoutId) mocks.timer = null;
  });
});

afterEach(cleanup);

describe("LiveWorkoutPage lifecycle", () => {
  it("reconciles a matching running timer when a paused workout loads", async () => {
    mocks.timer = {
      workoutId: "workout-1",
      durationSeconds: 90,
      status: "running",
      pauseReason: null,
      deadlineMs: Date.now() + 45_000,
      remainingSeconds: 45,
    };
    mocks.getWorkoutById.mockResolvedValueOnce(makeWorkout("DRAFT"));

    render(<LiveWorkoutPage />);

    await screen.findByText("Workout paused");
    await waitFor(() =>
      expect(mocks.pauseForWorkout).toHaveBeenCalledWith("workout-1"),
    );
  });

  it("pauses in place only after the pause request succeeds", async () => {
    render(<LiveWorkoutPage />);

    fireEvent.click(await screen.findByRole("button", { name: "Pause" }));

    await screen.findByText("Workout paused");
    expect(mocks.pauseWorkout).toHaveBeenCalledWith("workout-1");
    expect(mocks.pauseForWorkout).toHaveBeenCalledWith("workout-1");
    expect(mocks.push).not.toHaveBeenCalled();
    expect(screen.getByTestId("exercise-editor")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Resume" })).toBeEnabled();
    expect(
      screen.getByRole("button", { name: "Complete workout" }),
    ).toBeEnabled();
  });

  it("preserves the running workout and timer when pausing fails", async () => {
    mocks.pauseWorkout.mockRejectedValueOnce(new Error("request failed"));
    render(<LiveWorkoutPage />);

    fireEvent.click(await screen.findByRole("button", { name: "Pause" }));

    expect(
      await screen.findByText("The workout could not be paused. Please try again."),
    ).toBeInTheDocument();
    expect(mocks.pauseForWorkout).not.toHaveBeenCalled();
    expect(screen.getByText("Workout in progress")).toBeInTheDocument();
    expect(screen.getByTestId("exercise-editor")).toBeEnabled();
  });

  it("resumes a paused workout and its workout-paused timer", async () => {
    mocks.timer = {
      workoutId: "workout-1",
      durationSeconds: 90,
      status: "paused",
      pauseReason: "workout",
      deadlineMs: null,
      remainingSeconds: 45,
    };
    mocks.getWorkoutById.mockResolvedValueOnce(makeWorkout("DRAFT"));
    render(<LiveWorkoutPage />);

    fireEvent.click(await screen.findByRole("button", { name: "Resume" }));

    await screen.findByText("Workout in progress");
    expect(mocks.resumeWorkout).toHaveBeenCalledWith("workout-1");
    expect(mocks.resumeForWorkout).toHaveBeenCalledWith("workout-1");
    expect(screen.getByTestId("exercise-editor")).toBeEnabled();
  });

  it("clears the matching timer and navigates only after completion succeeds", async () => {
    mocks.timer = {
      workoutId: "workout-1",
      durationSeconds: 90,
      status: "running",
      pauseReason: null,
      deadlineMs: Date.now() + 45_000,
      remainingSeconds: 45,
    };
    render(<LiveWorkoutPage />);

    fireEvent.click(
      await screen.findByRole("button", { name: "Complete workout" }),
    );

    await waitFor(() =>
      expect(mocks.clearForWorkout).toHaveBeenCalledWith("workout-1"),
    );
    expect(mocks.push).toHaveBeenCalledWith("/workouts/workout-1");
    expect(mocks.completeWorkout.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.clearForWorkout.mock.invocationCallOrder[0],
    );
    expect(mocks.clearForWorkout.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.push.mock.invocationCallOrder[0],
    );
  });

  it("does not clear or navigate when completion fails", async () => {
    mocks.completeWorkout.mockRejectedValueOnce(new Error("request failed"));
    render(<LiveWorkoutPage />);

    fireEvent.click(
      await screen.findByRole("button", { name: "Complete workout" }),
    );

    expect(
      await screen.findByText(
        "The workout could not be completed. Please check your sets and try again.",
      ),
    ).toBeInTheDocument();
    expect(mocks.clearForWorkout).not.toHaveBeenCalled();
    expect(mocks.push).not.toHaveBeenCalled();
  });

  it("preserves loaded exercise data when completed navigation fails", async () => {
    mocks.completeWorkout.mockResolvedValueOnce({
      id: "workout-1",
      status: "COMPLETED",
      completedAt: "2026-08-12T13:00:00.000Z",
      durationMinutes: 60,
    } as Workout);
    mocks.push.mockRejectedValueOnce(new Error("navigation failed"));
    render(<LiveWorkoutPage />);

    fireEvent.click(
      await screen.findByRole("button", { name: "Complete workout" }),
    );

    expect(
      await screen.findByText(
        "The workout was completed, but its details could not be opened.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByTestId("exercise-editor")).toBeDisabled();
  });
});
