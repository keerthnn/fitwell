import { describe, expect, it } from "vitest";
import {
  validateCreateFeedback,
  validateFeedbackQuery,
  validateFeedbackReply,
  validateFeedbackTarget,
} from "./feedback";

describe("feedback validation", () => {
  it("accepts supported categories and trims submission text", () => {
    expect(
      validateCreateFeedback({
        category: "TECHNICAL_ISSUE",
        subject: "  Timer issue  ",
        message: "  The timer stops early.  ",
      }),
    ).toEqual({
      valid: true,
      data: {
        category: "TECHNICAL_ISSUE",
        subject: "Timer issue",
        message: "The timer stops early.",
      },
      errors: [],
    });
  });

  it("rejects invalid categories and overlong fields", () => {
    const result = validateCreateFeedback({
      category: "REVIEW",
      subject: "s".repeat(121),
      message: "m".repeat(4001),
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual([
      { field: "category", message: "Invalid category" },
      { field: "subject", message: "subject must be 120 characters or fewer" },
      { field: "message", message: "message must be 4000 characters or fewer" },
    ]);
  });

  it("requires a feedback ID and nonblank reply", () => {
    expect(validateFeedbackReply({ feedbackId: "", message: "   " })).toEqual({
      valid: false,
      errors: [
        { field: "feedbackId", message: "feedbackId is required" },
        { field: "message", message: "message is required" },
      ],
    });
  });

  it("parses list limits and rejects values above the cap", () => {
    expect(validateFeedbackQuery({ limit: "50", status: "OPEN" })).toEqual({
      valid: true,
      data: {
        search: undefined,
        cursor: undefined,
        category: undefined,
        status: "OPEN",
        limit: 50,
      },
      errors: [],
    });
    expect(validateFeedbackQuery({ limit: "101" }).valid).toBe(false);
    expect(validateFeedbackQuery({ status: "CLOSED" }).valid).toBe(true);
  });

  it("validates the target used by admin close actions", () => {
    expect(validateFeedbackTarget({ feedbackId: "feedback-1" })).toEqual({
      valid: true,
      data: { feedbackId: "feedback-1" },
      errors: [],
    });
    expect(validateFeedbackTarget({ feedbackId: "" }).valid).toBe(false);
  });
});
