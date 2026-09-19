// @vitest-environment jsdom

import { ThemeProvider } from "@mui/material/styles";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import DuplicateWorkoutPlanButton from "fitness/components/workout-plans/DuplicateWorkoutPlanButton";
import createAppTheme from "fitness/theme";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ duplicate: vi.fn(), push: vi.fn() }));

vi.mock("fitness/utils/spec", () => ({
  duplicateWorkoutPlan: mocks.duplicate,
}));
vi.mock("next/router", () => ({
  useRouter: () => ({ push: mocks.push }),
}));

function renderButton() {
  return render(
    <ThemeProvider theme={createAppTheme("light")}>
      <DuplicateWorkoutPlanButton planId="plan_1" planName="Strength" />
    </ThemeProvider>,
  );
}

describe("PLAN-010 A11Y-002 duplicate workout-plan dialog", () => {
  beforeEach(() => vi.resetAllMocks());
  afterEach(cleanup);

  it("prefills an editable copy name without creating data on open", async () => {
    renderButton();

    fireEvent.click(screen.getByRole("button", { name: "Duplicate plan" }));
    const dialog = await screen.findByRole("dialog");
    const input = within(dialog).getByRole("textbox", {
      name: /Plan name/,
    }) as HTMLInputElement;

    expect(input.value).toBe("Strength Copy");
    expect(mocks.duplicate).not.toHaveBeenCalled();
  });

  it.each([
    ["   ", "Plan name is required."],
    ["a".repeat(121), "Plan name must be 120 characters or fewer."],
  ])("blocks invalid names before the request", async (name, message) => {
    renderButton();
    fireEvent.click(screen.getByRole("button", { name: "Duplicate plan" }));
    const dialog = await screen.findByRole("dialog");
    fireEvent.change(within(dialog).getByRole("textbox", { name: /Plan name/ }), {
      target: { value: name },
    });

    fireEvent.click(within(dialog).getByRole("button", { name: "Duplicate plan" }));

    expect(await within(dialog).findByText(message)).toBeTruthy();
    expect(mocks.duplicate).not.toHaveBeenCalled();
  });

  it("submits a trimmed custom name and navigates to the created plan", async () => {
    mocks.duplicate.mockResolvedValue({ id: "copy_1" });
    renderButton();
    fireEvent.click(screen.getByRole("button", { name: "Duplicate plan" }));
    const dialog = await screen.findByRole("dialog");
    fireEvent.change(within(dialog).getByRole("textbox", { name: /Plan name/ }), {
      target: { value: "  My strength plan  " },
    });

    fireEvent.submit(
      within(dialog)
        .getByRole("textbox", { name: /Plan name/ })
        .closest("form")!,
    );

    await waitFor(() =>
      expect(mocks.duplicate).toHaveBeenCalledWith(
        "plan_1",
        "My strength plan",
      ),
    );
    expect(mocks.push).toHaveBeenCalledWith("/workout-plans/copy_1");
  });

  it("closes and clears pending state before navigation finishes", async () => {
    mocks.duplicate.mockResolvedValue({ id: "copy_1" });
    mocks.push.mockReturnValue(new Promise(() => undefined));
    renderButton();
    fireEvent.click(screen.getByRole("button", { name: "Duplicate plan" }));
    const dialog = await screen.findByRole("dialog");

    fireEvent.click(
      within(dialog).getByRole("button", { name: "Duplicate plan" }),
    );

    await waitFor(() =>
      expect(mocks.push).toHaveBeenCalledWith("/workout-plans/copy_1"),
    );
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());

    fireEvent.click(screen.getByRole("button", { name: "Duplicate plan" }));
    const reopenedDialog = await screen.findByRole("dialog");
    expect(
      within(reopenedDialog).getByRole("button", { name: "Duplicate plan" }),
    ).toBeTruthy();
  });

  it("locks repeat actions while pending and reports request failure", async () => {
    let rejectRequest!: (reason?: unknown) => void;
    mocks.duplicate.mockReturnValue(
      new Promise((_resolve, reject) => {
        rejectRequest = reject;
      }),
    );
    renderButton();
    fireEvent.click(screen.getByRole("button", { name: "Duplicate plan" }));
    const dialog = await screen.findByRole("dialog");

    fireEvent.click(within(dialog).getByRole("button", { name: "Duplicate plan" }));

    const pending = await within(dialog).findByRole("button", {
      name: "Duplicating…",
    });
    expect(pending.hasAttribute("disabled")).toBe(true);
    expect(within(dialog).getByRole("button", { name: "Cancel" }).hasAttribute("disabled")).toBe(true);
    expect(mocks.duplicate).toHaveBeenCalledTimes(1);

    rejectRequest(new Error("network"));
    expect(
      await within(dialog).findByText("The workout plan could not be duplicated. Please try again."),
    ).toBeTruthy();
    expect(mocks.push).not.toHaveBeenCalled();
  });
});
