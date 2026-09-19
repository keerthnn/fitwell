// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, expect, it, vi } from "vitest";
import EditWorkoutPage from "fitness/pages/workouts/[id]/edit";

const mocks = vi.hoisted(() => ({ getWorkoutById: vi.fn(), updateWorkout: vi.fn(), push: vi.fn() }));
vi.mock("next/router", () => ({ useRouter: () => ({ query: { id: "w1" }, push: mocks.push }) }));
vi.mock("fitness/utils/spec", () => ({ ...mocks, completeWorkout: vi.fn() }));
vi.mock("fitness/components/AuthenticatedPage", () => ({ default: ({ children }: { children: ReactNode }) => children }));
vi.mock("fitness/components/common/PageHeader", () => ({ default: () => null }));
vi.mock("fitness/components/workouts/WorkoutExerciseEditor", () => ({
  default: ({ onReload }: { onReload: () => Promise<void> }) => <button onClick={() => void onReload()}>Refresh exercises</button>,
}));
afterEach(cleanup);

it("WORKOUT-019 DES-011 preserves unsaved name and notes across exercise refresh", async () => {
  mocks.getWorkoutById.mockResolvedValue({
    id: "w1", name: "Saved name", notes: "Saved notes", entryMode: "QUICK_ENTRY",
    status: "DRAFT", workoutDate: "2026-09-19", exercises: [],
  });
  render(<EditWorkoutPage />);
  fireEvent.change(await screen.findByLabelText("Name"), { target: { value: "Draft name" } });
  fireEvent.change(screen.getByLabelText("Notes"), { target: { value: "Draft notes" } });
  fireEvent.click(screen.getByRole("button", { name: "Refresh exercises" }));
  await waitFor(() => expect(mocks.getWorkoutById).toHaveBeenCalledTimes(2));
  fireEvent.click(screen.getByRole("button", { name: "Save workout" }));
  await waitFor(() => expect(mocks.updateWorkout).toHaveBeenCalledWith(expect.objectContaining({
    name: "Draft name", notes: "Draft notes",
  })));
});
