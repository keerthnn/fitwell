// @vitest-environment jsdom

import { ThemeProvider } from "@mui/material/styles";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import MuscleBodyDiagram from "fitness/components/exercise-discovery/MuscleBodyDiagram";
import createAppTheme from "fitness/theme";
import type { MuscleGroup } from "fitness/utils/exerciseDiscovery";
import { useState } from "react";
import { afterEach, describe, expect, it } from "vitest";

afterEach(cleanup);

function Harness() {
  const [selected, setSelected] = useState<MuscleGroup[]>([]);
  const [view, setView] = useState<"front" | "back">("front");
  return (
    <ThemeProvider theme={createAppTheme("light")}>
      <MuscleBodyDiagram
        selected={selected}
        view={view}
        onViewChange={setView}
        onToggle={(group: MuscleGroup) =>
          setSelected((current) =>
            current.includes(group)
              ? current.filter((item) => item !== group)
              : [...current, group],
          )
        }
      />
    </ThemeProvider>
  );
}

describe("EXERCISE-010 A11Y-005 DES-004 DES-005 muscle body diagram", () => {
  it("exposes exactly all twelve groups through labeled controls", () => {
    render(<Harness />);

    const names = [
      "Chest",
      "Back",
      "Shoulders",
      "Biceps",
      "Triceps",
      "Quadriceps",
      "Hamstrings",
      "Glutes",
      "Calves",
      "Abs",
      "Traps",
      "Forearms",
    ];
    expect(
      names.map((name) => screen.getByRole("button", { name })),
    ).toHaveLength(12);
  });

  it("keeps diagram and labeled controls synchronized without color alone", () => {
    render(<Harness />);

    fireEvent.click(
      screen.getByRole("button", { name: "Chest muscle on front body" }),
    );

    expect(
      screen.getByRole("button", { name: "Chest" }).getAttribute("aria-pressed"),
    ).toBe("true");
    expect(screen.getByText("Selected muscles: Chest")).toBeTruthy();
  });

  it("retains selection across views and supports keyboard activation", () => {
    render(<Harness />);

    fireEvent.keyDown(
      screen.getByRole("button", { name: "Shoulders muscle on front body" }),
      { key: "Enter" },
    );
    fireEvent.click(screen.getByRole("button", { name: "Back view" }));

    expect(
      screen
        .getByRole("button", { name: "Shoulders" })
        .getAttribute("aria-pressed"),
    ).toBe("true");
    expect(
      screen
        .getByRole("button", { name: "Shoulders muscle on back body" })
        .getAttribute("aria-pressed"),
    ).toBe("true");
    expect(
      screen.getByRole("button", { name: "Back muscle on back body" }),
    ).toBeTruthy();
  });

  it("A11Y-005 activates Space on release without repeated toggles", () => {
    render(<Harness />);
    const chest = screen.getByRole("button", { name: "Chest muscle on front body" });
    fireEvent.keyDown(chest, { key: " " });
    fireEvent.keyDown(chest, { key: " ", repeat: true });
    expect(chest.getAttribute("aria-pressed")).toBe("false");
    fireEvent.keyUp(chest, { key: " " });
    expect(chest.getAttribute("aria-pressed")).toBe("true");
  });
});
