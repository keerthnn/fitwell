// @vitest-environment jsdom

import { ThemeProvider } from "@mui/material/styles";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import type { ReactNode } from "react";
import ProfilePage from "fitness/pages/profile";
import createAppTheme from "fitness/theme";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  deleteAccount: vi.fn(),
  getWorkoutActivity: vi.fn(),
  getUserProfile: vi.fn(),
  push: vi.fn(),
  replace: vi.fn(),
  signOutUser: vi.fn(),
}));

vi.mock("fitness/components/AuthenticatedPage", () => ({
  default: ({ children }: { children: ReactNode }) => children,
}));
vi.mock("fitness/lib/authUtils", () => ({ signOutUser: mocks.signOutUser }));
vi.mock("fitness/utils/spec", () => ({
  deleteAccount: mocks.deleteAccount,
  getWorkoutActivity: mocks.getWorkoutActivity,
  getUserProfile: mocks.getUserProfile,
}));
vi.mock("next/router", () => ({
  useRouter: () => ({ push: mocks.push, replace: mocks.replace }),
}));

const profile = {
  firstName: "Keerthan",
  lastName: "K",
  unitSystem: "METRIC" as const,
  fitnessGoal: "BUILD_MUSCLE" as const,
  experienceLevel: "INTERMEDIATE" as const,
  weeklyWorkoutTarget: 4,
  timezone: "Asia/Kolkata",
  onboardingCompleted: true,
  heightCm: 175,
  currentWeightKg: 70,
};

const activity = {
  timezone: "Asia/Kolkata",
  startDate: "2025-09-15",
  endDate: "2026-09-20",
  todayDate: "2026-09-16",
  completedDates: ["2026-09-14"],
};

function renderPage() {
  return render(
    <ThemeProvider theme={createAppTheme("light")}>
      <ProfilePage />
    </ThemeProvider>,
  );
}

describe("Profile account sections", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getUserProfile.mockResolvedValue(profile);
    mocks.getWorkoutActivity.mockResolvedValue(activity);
    mocks.signOutUser.mockResolvedValue(undefined);
    mocks.deleteAccount.mockResolvedValue({ success: true });
  });
  afterEach(cleanup);

  it("PROFILE-004 PROFILE-005 shows profile data, editing, and sign out in the Profile tab", async () => {
    renderPage();

    expect(screen.getAllByRole("tab").map((tab) => tab.textContent)).toEqual([
      "Profile",
      "Delete account",
    ]);
    expect(await screen.findByText("Keerthan K")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Edit profile" }).getAttribute("href")).toBe(
      "/profile/edit",
    );

    fireEvent.click(screen.getByRole("button", { name: "Sign out" }));
    await waitFor(() => expect(mocks.signOutUser).toHaveBeenCalledTimes(1));
    expect(mocks.push).toHaveBeenCalledWith("/");
  });

  it("PROFILE-010 DES-009 DES-011 renders activity in Profile before Session and never in Delete account", async () => {
    renderPage();

    const activityHeading = await screen.findByRole("heading", {
      name: "Workout activity",
    });
    const sessionHeading = screen.getByRole("heading", { name: "Session" });
    expect(mocks.getWorkoutActivity).toHaveBeenCalledTimes(1);
    expect(
      activityHeading.compareDocumentPosition(sessionHeading) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    fireEvent.click(screen.getByRole("tab", { name: "Delete account" }));
    expect(
      screen.queryByRole("heading", { name: "Workout activity" }),
    ).toBeNull();
    expect(
      screen.getByRole("button", { name: "Delete application account" }),
    ).toBeTruthy();
  });

  it("PROFILE-012 DES-010 distinguishes empty activity from loading", async () => {
    let resolveActivity: ((value: typeof activity) => void) | undefined;
    mocks.getWorkoutActivity.mockReturnValue(
      new Promise((resolve) => {
        resolveActivity = resolve;
      }),
    );
    renderPage();

    expect(await screen.findByText("Keerthan K")).toBeTruthy();
    expect(
      screen.getByLabelText("Loading workout activity"),
    ).toBeTruthy();

    await act(async () => {
      resolveActivity?.({ ...activity, completedDates: [] });
    });
    expect(
      await screen.findByText("No completed workouts in this period."),
    ).toBeTruthy();
    expect(screen.queryByLabelText("Loading workout activity")).toBeNull();
  });

  it("PROFILE-012 DES-010 retries activity without reloading or hiding Profile actions", async () => {
    mocks.getWorkoutActivity
      .mockRejectedValueOnce(new Error("network"))
      .mockResolvedValueOnce(activity);
    renderPage();

    expect(
      await screen.findByText("Your workout activity could not be loaded."),
    ).toBeTruthy();
    expect(screen.getByRole("link", { name: "Edit profile" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Sign out" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));

    expect(
      await screen.findByRole("heading", { name: "Workout activity" }),
    ).toBeTruthy();
    expect(mocks.getWorkoutActivity).toHaveBeenCalledTimes(2);
    expect(mocks.getUserProfile).toHaveBeenCalledTimes(1);
  });

  it("PROFILE-008 isolates account deletion and requires confirmation", async () => {
    renderPage();
    fireEvent.click(screen.getByRole("tab", { name: "Delete account" }));

    expect(await screen.findByText(/Firebase identity is preserved/i)).toBeTruthy();
    fireEvent.click(
      screen.getByRole("button", { name: "Delete application account" }),
    );
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText(/cannot be undone/i)).toBeTruthy();
    expect(mocks.deleteAccount).not.toHaveBeenCalled();

    fireEvent.click(within(dialog).getByRole("button", { name: "Confirm" }));
    await waitFor(() => expect(mocks.deleteAccount).toHaveBeenCalledTimes(1));
    expect(mocks.signOutUser).toHaveBeenCalledTimes(1);
    expect(mocks.replace).toHaveBeenCalledWith("/");
  });

  it("PROFILE-008 cancels deletion without changing the account", async () => {
    renderPage();
    fireEvent.click(screen.getByRole("tab", { name: "Delete account" }));
    fireEvent.click(
      screen.getByRole("button", { name: "Delete application account" }),
    );
    const dialog = await screen.findByRole("dialog");

    fireEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(mocks.deleteAccount).not.toHaveBeenCalled();
  });

  it("PROFILE-004 keeps account actions available when profile loading fails", async () => {
    mocks.getUserProfile.mockRejectedValue(new Error("network"));
    renderPage();

    expect(await screen.findByText("Your profile could not be loaded.")).toBeTruthy();
    expect(
      await screen.findByRole("heading", { name: "Workout activity" }),
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "Sign out" })).toBeTruthy();
    fireEvent.click(screen.getByRole("tab", { name: "Delete account" }));
    expect(
      screen.getByRole("button", { name: "Delete application account" }),
    ).toBeTruthy();
  });

  it("PROFILE-004 directs members without a profile to onboarding", async () => {
    mocks.getUserProfile.mockResolvedValue(null);
    renderPage();

    expect(
      (await screen.findByRole("link", { name: "Complete onboarding" })).getAttribute(
        "href",
      ),
    ).toBe("/onboarding");
  });
});
