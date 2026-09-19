// @vitest-environment jsdom

import { ThemeProvider } from "@mui/material/styles";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import DeleteWorkoutPlanButton from "fitness/components/workout-plans/DeleteWorkoutPlanButton";
import createAppTheme from "fitness/theme";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ remove: vi.fn(), push: vi.fn() }));

vi.mock("fitness/utils/spec", () => ({ deleteWorkoutPlan: mocks.remove }));
vi.mock("next/router", () => ({
  useRouter: () => ({ push: mocks.push }),
}));

function renderButton() {
  return render(
    <ThemeProvider theme={createAppTheme("light")}>
      <DeleteWorkoutPlanButton planId="plan_1" planName="Strength" />
    </ThemeProvider>,
  );
}

describe("PLAN-013 A11Y-004 delete workout-plan confirmation", () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(cleanup);

  it("names the plan and warns that deletion cannot be undone", async () => {
    renderButton();
    fireEvent.click(screen.getByRole("button", { name: "Delete plan" }));
    const dialog = await screen.findByRole("dialog");

    expect(within(dialog).getByText(/“Strength”/)).toBeTruthy();
    expect(within(dialog).getByText(/cannot be undone/i)).toBeTruthy();
    expect(mocks.remove).not.toHaveBeenCalled();
  });

  it("cancels without sending a delete request", async () => {
    renderButton();
    fireEvent.click(screen.getByRole("button", { name: "Delete plan" }));
    const dialog = await screen.findByRole("dialog");

    fireEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(mocks.remove).not.toHaveBeenCalled();
  });

  it("deletes only after confirmation and returns to the plan library", async () => {
    mocks.remove.mockResolvedValue({ success: true });
    renderButton();
    fireEvent.click(screen.getByRole("button", { name: "Delete plan" }));
    const dialog = await screen.findByRole("dialog");

    fireEvent.click(within(dialog).getByRole("button", { name: "Delete plan" }));

    await waitFor(() => expect(mocks.remove).toHaveBeenCalledWith("plan_1"));
    expect(mocks.push).toHaveBeenCalledWith("/workout-plans");
  });

  it("locks repeat actions while pending and reports request failure", async () => {
    let rejectRequest!: (reason?: unknown) => void;
    mocks.remove.mockReturnValue(
      new Promise((_resolve, reject) => {
        rejectRequest = reject;
      }),
    );
    renderButton();
    fireEvent.click(screen.getByRole("button", { name: "Delete plan" }));
    const dialog = await screen.findByRole("dialog");

    fireEvent.click(within(dialog).getByRole("button", { name: "Delete plan" }));

    const pending = await within(dialog).findByRole("button", {
      name: "Deleting…",
    });
    expect(pending.hasAttribute("disabled")).toBe(true);
    expect(within(dialog).getByRole("button", { name: "Cancel" }).hasAttribute("disabled")).toBe(true);
    expect(mocks.remove).toHaveBeenCalledTimes(1);

    rejectRequest(new Error("network"));
    expect(
      await within(dialog).findByText("The workout plan could not be deleted. Please try again."),
    ).toBeTruthy();
    expect(mocks.push).not.toHaveBeenCalled();
  });
});
