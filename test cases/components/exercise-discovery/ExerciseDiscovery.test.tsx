// @vitest-environment jsdom

import { ThemeProvider } from "@mui/material/styles";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import ExerciseDiscovery from "fitness/components/exercise-discovery/ExerciseDiscovery";
import { resolveEquipmentImageCandidates, resolveExerciseImageCandidates } from "fitness/lib/images/assetRegistry";
import createAppTheme from "fitness/theme";
import type { Exercise } from "fitness/utils/types";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ getExercises: vi.fn() }));
vi.mock("fitness/utils/spec", () => ({ getExercises: mocks.getExercises }));

const exercise = (id: string, name: string): Exercise => ({
  id,
  name,
  description: null,
  instructions: null,
  equipment: "DUMBBELL",
  movement: "PUSH",
  category: "Chest",
  primaryMuscle: "Chest",
  secondaryMuscles: [],
  isCompound: true,
  trackingType: "REPS_WEIGHT",
  isActive: true,
  imagePath: null,
  thumbnailPath: null,
  equipmentImagePath: null,
});

function renderDiscovery(
  selectedExerciseIds: string[] = [],
  onAdd = vi.fn(),
) {
  return render(
    <ThemeProvider theme={createAppTheme("light")}>
      <ExerciseDiscovery
        selectedExerciseIds={selectedExerciseIds}
        onAdd={onAdd}
      />
    </ThemeProvider>,
  );
}

describe("EXERCISE-012 EXERCISE-013 EXERCISE-014 EXERCISE-015 ExerciseDiscovery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getExercises.mockResolvedValue({ items: [], nextCursor: null });
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("starts with a prompt and makes no request until Browse all or a muscle", async () => {
    renderDiscovery();

    expect(screen.getByText("Select one or more muscles")).toBeTruthy();
    expect(mocks.getExercises).not.toHaveBeenCalled();

    fireEvent.click(
      screen.getByRole("button", { name: "Browse all exercises" }),
    );
    await waitFor(() =>
      expect(mocks.getExercises).toHaveBeenCalledWith(
        { limit: "24" },
        expect.anything(),
      ),
    );

    fireEvent.click(screen.getByRole("button", { name: "Chest" }));
    await waitFor(() =>
      expect(mocks.getExercises).toHaveBeenLastCalledWith(
        { categories: "Chest", limit: "24" },
        expect.anything(),
      ),
    );

    fireEvent.click(screen.getByRole("button", { name: "Clear muscles" }));
    expect(screen.getByText("Select one or more muscles")).toBeTruthy();
  });

  it("debounces trimmed search within the active muscle criteria", async () => {
    renderDiscovery();
    fireEvent.click(screen.getByRole("button", { name: "Chest" }));
    await waitFor(() => expect(mocks.getExercises).toHaveBeenCalledTimes(1));

    fireEvent.change(screen.getByLabelText("Search matching exercises"), {
      target: { value: "  press  " },
    });
    await waitFor(
      () =>
        expect(mocks.getExercises).toHaveBeenLastCalledWith(
          { categories: "Chest", search: "press", limit: "24" },
          expect.anything(),
        ),
      { timeout: 1000 },
    );
  });

  it("keeps loaded results when a later page fails and retries its cursor", async () => {
    mocks.getExercises
      .mockResolvedValueOnce({
        items: [exercise("exercise_1", "Bench press")],
        nextCursor: "exercise_1",
      })
      .mockRejectedValueOnce(new Error("page failed"))
      .mockResolvedValueOnce({
        items: [exercise("exercise_2", "Incline press")],
        nextCursor: null,
      });
    renderDiscovery();

    fireEvent.click(screen.getByRole("button", { name: "Chest" }));
    expect(await screen.findByText("Bench press")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Load more" }));
    expect(
      await screen.findByText("More exercises could not be loaded."),
    ).toBeTruthy();
    expect(screen.getByText("Bench press")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));

    expect(await screen.findByText("Incline press")).toBeTruthy();
    expect(mocks.getExercises).toHaveBeenLastCalledWith(
      { categories: "Chest", limit: "24", cursor: "exercise_1" },
      expect.anything(),
    );
  });

  it("DES-015 hides obsolete matches immediately during the search debounce", async () => {
    mocks.getExercises.mockResolvedValue({
      items: [exercise("old", "Old press")], nextCursor: null,
    });
    renderDiscovery();
    fireEvent.click(screen.getByRole("button", { name: "Chest" }));
    await screen.findByText("Old press");
    fireEvent.change(screen.getByLabelText("Search matching exercises"), {
      target: { value: "new" },
    });
    expect(screen.queryByText("Old press")).toBeNull();
    expect(mocks.getExercises).toHaveBeenCalledTimes(1);
  });

  it("shows distinct failure and retries the same criteria", async () => {
    mocks.getExercises
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValueOnce({ items: [], nextCursor: null });
    renderDiscovery();

    fireEvent.click(screen.getByRole("button", { name: "Chest" }));
    expect(await screen.findByText("Exercises could not be loaded.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));

    await waitFor(() => expect(mocks.getExercises).toHaveBeenCalledTimes(2));
    expect(await screen.findByText("No matching exercises")).toBeTruthy();
  });

  it("ignores obsolete responses after criteria changes", async () => {
    let resolveChest: ((value: unknown) => void) | undefined;
    let resolveUnion: ((value: unknown) => void) | undefined;
    mocks.getExercises
      .mockReturnValueOnce(new Promise((resolve) => (resolveChest = resolve)))
      .mockReturnValueOnce(new Promise((resolve) => (resolveUnion = resolve)));
    renderDiscovery();

    fireEvent.click(screen.getByRole("button", { name: "Chest" }));
    await waitFor(() => expect(mocks.getExercises).toHaveBeenCalledTimes(1));
    fireEvent.click(screen.getByRole("button", { name: "Triceps" }));
    await waitFor(() => expect(mocks.getExercises).toHaveBeenCalledTimes(2));

    await act(async () => {
      resolveUnion?.({ items: [exercise("current", "Current press")], nextCursor: null });
    });
    expect(await screen.findByText("Current press")).toBeTruthy();

    await act(async () => {
      resolveChest?.({ items: [exercise("old", "Old press")], nextCursor: null });
    });
    expect(screen.queryByText("Old press")).toBeNull();
  });

  it("only explicit Add mutates caller-owned selection", async () => {
    const onAdd = vi.fn();
    mocks.getExercises.mockResolvedValue({
      items: [exercise("exercise_1", "Bench press")],
      nextCursor: null,
    });
    const { rerender } = renderDiscovery([], onAdd);

    fireEvent.click(screen.getByRole("button", { name: "Chest" }));
    expect(await screen.findByText("Bench press")).toBeTruthy();
    expect(onAdd).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Add Bench press" }));
    expect(onAdd).toHaveBeenCalledTimes(1);

    rerender(
      <ThemeProvider theme={createAppTheme("light")}>
        <ExerciseDiscovery selectedExerciseIds={["exercise_1"]} onAdd={onAdd} />
      </ThemeProvider>,
    );
    expect(
      (screen.getByRole("button", {
        name: "Added Bench press",
      }) as HTMLButtonElement).disabled,
    ).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Back view" }));
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it("shows catalogue imagery for matching exercises and recovers from unavailable images", async () => {
    const match = exercise("exercise_1", "Bench press");
    const candidates = resolveExerciseImageCandidates(match);
    const onAdd = vi.fn();
    mocks.getExercises.mockResolvedValue({ items: [match], nextCursor: null });
    renderDiscovery([], onAdd);
    fireEvent.click(screen.getByRole("button", { name: "Chest" }));
    const name = "Bench press exercise illustration";
    const illustration = await screen.findByRole("img", { name });
    expect(illustration.getAttribute("src")).toBe(candidates[0].src);
    for (const candidate of candidates) {
      const current = screen.getByRole("img", { name });
      expect(current.getAttribute("src")).toBe(candidate.src);
      fireEvent.error(current);
    }
    expect(screen.getByRole("img", { name }).getAttribute("src")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Add Bench press" }));
    expect(onAdd).toHaveBeenCalledWith(match);
  });

  it("EXERCISE-012 equipment combines with muscles and paging and resets without changing chosen exercises", async () => {
    mocks.getExercises.mockResolvedValue({ items: [exercise("chosen", "Bench press")], nextCursor: "chosen" });
    const onAdd = vi.fn();
    renderDiscovery(["chosen"], onAdd);
    for (const label of ["All equipment", "Barbell", "Dumbbell", "Kettlebell", "Machine", "Bodyweight", "Cable"]) {
      expect(screen.getByRole("button", { name: label })).toBeTruthy();
      if (label !== "All equipment") {
        const button = screen.getByRole("button", { name: label });
        expect(button.querySelector("img")?.getAttribute("src")).toBe(resolveEquipmentImageCandidates(label)[0].src);
        expect(button.textContent).toBe("");
      }
    }
    fireEvent.click(screen.getByRole("button", { name: "Barbell" }));
    expect(mocks.getExercises).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Chest" }));
    await screen.findByText("Bench press");
    expect(mocks.getExercises).toHaveBeenLastCalledWith({ categories: "Chest", equipment: "BARBELL", limit: "24" }, expect.anything());
    fireEvent.click(screen.getByRole("button", { name: "Load more" }));
    await waitFor(() => expect(mocks.getExercises).toHaveBeenLastCalledWith({ categories: "Chest", equipment: "BARBELL", limit: "24", cursor: "chosen" }, expect.anything()));
    fireEvent.click(screen.getByRole("button", { name: "Bodyweight" }));
    await waitFor(() => expect(mocks.getExercises).toHaveBeenLastCalledWith({ categories: "Chest", equipment: "BODYWEIGHT", limit: "24" }, expect.anything()));
    expect(screen.getByRole("button", { name: "Bodyweight" }).getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(screen.getByRole("button", { name: "All equipment" }));
    await screen.findByText("Bench press");
    expect(mocks.getExercises).toHaveBeenLastCalledWith({ categories: "Chest", limit: "24" }, expect.anything());
    expect((screen.getByRole("button", { name: "Added Bench press" }) as HTMLButtonElement).disabled).toBe(true);
    expect(onAdd).not.toHaveBeenCalled();
  });

  it("EXERCISE-012 ignores obsolete equipment results and filters Browse all", async () => {
    let resolveOld: ((value: unknown) => void) | undefined;
    mocks.getExercises.mockReturnValueOnce(new Promise((resolve) => { resolveOld = resolve; }))
      .mockResolvedValue({ items: [exercise("new", "Cable press")], nextCursor: null });
    renderDiscovery();
    fireEvent.click(screen.getByRole("button", { name: "Browse all exercises" }));
    fireEvent.click(screen.getByRole("button", { name: "Cable" }));
    await screen.findByText("Cable press");
    expect(mocks.getExercises).toHaveBeenLastCalledWith({ equipment: "CABLE", limit: "24" }, expect.anything());
    await act(async () => { resolveOld?.({ items: [exercise("old", "Old press")], nextCursor: null }); });
    expect(screen.queryByText("Old press")).toBeNull();
    expect(screen.getByText("Cable press")).toBeTruthy();
  });
});
