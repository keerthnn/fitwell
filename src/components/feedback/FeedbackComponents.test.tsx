// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import FeedbackCreateForm from "./FeedbackCreateForm";
import FeedbackThreadView from "./FeedbackThreadView";

vi.mock("fitness/utils/spec", () => ({ createFeedback: vi.fn() }));

describe("feedback components", () => {
  it("shows field errors for an empty submission", () => {
    render(<FeedbackCreateForm onCreated={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Submit feedback" }));

    expect(screen.getByText("Subject is required.")).toBeInTheDocument();
    expect(screen.getByText("Message is required.")).toBeInTheDocument();
  });

  it("uses generic support identity in the member conversation", () => {
    render(
      <FeedbackThreadView
        viewerRole="USER"
        messages={[
          {
            id: "message-1",
            authorRole: "USER",
            content: "My question",
            createdAt: "2026-08-12T00:00:00Z",
          },
          {
            id: "message-2",
            authorRole: "ADMIN",
            content: "Support response",
            createdAt: "2026-08-12T01:00:00Z",
          },
        ]}
      />,
    );

    expect(screen.getByText("You")).toBeInTheDocument();
    expect(screen.getByText("FitWell Support")).toBeInTheDocument();
    expect(screen.queryByText(/@/)).not.toBeInTheDocument();
  });
});
