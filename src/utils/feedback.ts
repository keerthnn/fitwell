import type { FeedbackCategory } from "fitness/utils/types";

export const feedbackCategoryOptions: Array<{
  value: FeedbackCategory;
  label: string;
}> = [
  { value: "TECHNICAL_ISSUE", label: "Technical issue" },
  { value: "ACCOUNT_ISSUE", label: "Account issue" },
  { value: "WORKOUT_CONTENT", label: "Workout content" },
  { value: "SUGGESTION", label: "Suggestion" },
  { value: "OTHER", label: "Other" },
];

export const feedbackCategoryLabel = (category: FeedbackCategory) =>
  feedbackCategoryOptions.find((option) => option.value === category)?.label ??
  category.replaceAll("_", " ").toLowerCase();
