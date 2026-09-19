// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import MuscleBodyDiagram from "fitness/components/exercise-discovery/MuscleBodyDiagram";

vi.mock("fitness/components/exercise-discovery/BodyFigure", async (importOriginal) => ({
  ...await importOriginal<typeof import("fitness/components/exercise-discovery/BodyFigure")>(),
  default: () => { throw new Error("SVG render failed"); },
}));
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

it("A11Y-005 DES-006 keeps labeled muscle selection usable when SVG rendering fails", () => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  const onToggle = vi.fn();
  render(<MuscleBodyDiagram selected={[]} view="front" onViewChange={vi.fn()} onToggle={onToggle} />);
  expect(screen.queryByRole("group", { name: "Front muscle selection body" })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Chest" }));
  expect(onToggle).toHaveBeenCalledWith("Chest");
  expect(screen.getByRole("button", { name: "Forearms" })).toBeTruthy();
});
