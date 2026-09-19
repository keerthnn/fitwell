import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import PageHeader from "fitness/components/common/PageHeader";

describe("PageHeader navigation", () => {
  it("A11Y-001 renders a labeled back link to the provided parent route", () => {
    const html = renderToStaticMarkup(
      <PageHeader
        title="Edit workout"
        backLink={{ label: "Back to workout", href: "/workouts/workout-1" }}
      />,
    );

    expect(html).toContain('href="/workouts/workout-1"');
    expect(html).toContain('aria-label="Back to workout"');
    expect(html).not.toContain(">Back to workout<");
    expect(html).toContain("Edit workout");
  });

  it("does not add back navigation to a top-level header", () => {
    const html = renderToStaticMarkup(<PageHeader title="Settings" />);

    expect(html).not.toContain("Back to");
  });
});
