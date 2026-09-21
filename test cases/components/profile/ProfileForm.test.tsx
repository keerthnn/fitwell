// @vitest-environment jsdom

import { ThemeProvider } from "@mui/material/styles";
import { cleanup, render, screen } from "@testing-library/react";
import ProfileForm from "fitness/components/profile/ProfileForm";
import createAppTheme from "fitness/theme";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("PROFILE-002 PROFILE-003 DES-004 workout-day question", () => {
  afterEach(cleanup);

  it("asks for days and offers only one through seven", () => {
    render(
      <ThemeProvider theme={createAppTheme("light")}>
        <ProfileForm submitLabel="Save" onSubmit={vi.fn()} />
      </ThemeProvider>,
    );

    const target = screen.getByLabelText(
      "How many days do you want to work out each week?",
    );
    expect(target.getAttribute("role")).toBe("combobox");
    expect(target.getAttribute("aria-expanded")).toBe("false");
  });
});
