import type {
  FeedbackCategory,
  FeedbackStatus,
  RequestInputValue,
  ValidationError,
} from "fitness/utils/types";
import {
  enumValue,
  idValue,
  invalid,
  numberValue,
  record,
  text,
  valid,
} from "./common";

export const feedbackCategories = [
  "TECHNICAL_ISSUE",
  "ACCOUNT_ISSUE",
  "WORKOUT_CONTENT",
  "SUGGESTION",
  "OTHER",
] as const satisfies readonly FeedbackCategory[];

export const feedbackStatuses = [
  "OPEN",
  "RESPONDED",
  "CLOSED",
] as const satisfies readonly FeedbackStatus[];

export function validateCreateFeedback(value: RequestInputValue) {
  const input = record(value);
  const errors: ValidationError[] = [];
  if (!input)
    return invalid<{
      category: FeedbackCategory;
      subject: string;
      message: string;
    }>([{ field: "feedback", message: "Feedback is required" }]);

  const category = enumValue(
    input.category,
    "category",
    feedbackCategories,
    errors,
  );
  const subject = text(input.subject, "subject", errors, {
    required: true,
    max: 120,
  });
  const message = text(input.message, "message", errors, {
    required: true,
    max: 4000,
  });

  return errors.length || !category || !subject || !message
    ? invalid<{
        category: FeedbackCategory;
        subject: string;
        message: string;
      }>(errors)
    : valid({ category, subject, message });
}

export function validateFeedbackReply(value: RequestInputValue) {
  const input = record(value);
  const errors: ValidationError[] = [];
  const feedbackId = idValue(input?.feedbackId, "feedbackId", errors);
  const message = text(input?.message, "message", errors, {
    required: true,
    max: 4000,
  });
  return errors.length || !feedbackId || !message
    ? invalid<{ feedbackId: string; message: string }>(errors)
    : valid({ feedbackId, message });
}

export function validateFeedbackTarget(value: RequestInputValue) {
  const input = record(value);
  const errors: ValidationError[] = [];
  const feedbackId = idValue(input?.feedbackId, "feedbackId", errors);
  return errors.length || !feedbackId
    ? invalid<{ feedbackId: string }>(errors)
    : valid({ feedbackId });
}

export function validateFeedbackQuery(value: RequestInputValue) {
  const input = record(value);
  const errors: ValidationError[] = [];
  const search = text(input?.search, "search", errors, { max: 120 });
  const cursor = text(input?.cursor, "cursor", errors, { max: 128 });
  const category = input?.category
    ? enumValue(
        input.category,
        "category",
        feedbackCategories,
        errors,
      )
    : undefined;
  const status = input?.status
    ? enumValue(input.status, "status", feedbackStatuses, errors)
    : undefined;
  const limit = numberValue(
    typeof input?.limit === "string" ? Number(input.limit) : input?.limit,
    "limit",
    errors,
    { min: 1, max: 100, integer: true },
  );

  return errors.length
    ? invalid<{
        search?: string;
        cursor?: string;
        category?: FeedbackCategory;
        status?: FeedbackStatus;
        limit: number;
      }>(errors)
    : valid({ search, cursor, category, status, limit: limit ?? 25 });
}
