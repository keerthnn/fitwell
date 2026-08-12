import { Alert, Button, MenuItem, Paper, Stack, TextField } from "@mui/material";
import axios from "axios";
import { createFeedback } from "fitness/utils/spec";
import { feedbackCategoryOptions } from "fitness/utils/feedback";
import type {
  ApiError,
  FeedbackCategory,
  ValidationError,
} from "fitness/utils/types";
import { useState } from "react";

const detailsByField = (details?: ValidationError[]) =>
  Object.fromEntries((details ?? []).map((detail) => [detail.field, detail.message]));

export default function FeedbackCreateForm({
  onCreated,
}: {
  onCreated: (id: string) => Promise<void>;
}) {
  const [category, setCategory] =
    useState<FeedbackCategory>("TECHNICAL_ISSUE");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    const fieldErrors: Record<string, string> = {};
    if (!subject.trim()) fieldErrors.subject = "Subject is required.";
    else if (subject.trim().length > 120)
      fieldErrors.subject = "Subject must be 120 characters or fewer.";
    if (!message.trim()) fieldErrors.message = "Message is required.";
    else if (message.trim().length > 4000)
      fieldErrors.message = "Message must be 4,000 characters or fewer.";
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length) return;

    setError("");
    setSubmitting(true);
    try {
      const result = await createFeedback({ category, subject, message });
      await onCreated(result.id);
    } catch (caught) {
      if (axios.isAxiosError<ApiError>(caught)) {
        setErrors(detailsByField(caught.response?.data?.details));
      }
      setError("Your feedback could not be submitted. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
      <Stack gap={2}>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          select
          label="Category"
          value={category}
          onChange={(event) =>
            setCategory(event.target.value as FeedbackCategory)
          }
        >
          {feedbackCategoryOptions.map((option) => (
            <MenuItem value={option.value} key={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Subject"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          error={Boolean(errors.subject)}
          helperText={errors.subject ?? `${subject.length} / 120`}
          slotProps={{ htmlInput: { maxLength: 121 } }}
        />
        <TextField
          label="Tell us what happened or what you would like to see"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          multiline
          minRows={5}
          error={Boolean(errors.message)}
          helperText={errors.message ?? `${message.length.toLocaleString()} / 4,000`}
          slotProps={{ htmlInput: { maxLength: 4001 } }}
        />
        <Button
          variant="contained"
          onClick={() => void submit()}
          disabled={submitting}
          sx={{ alignSelf: { sm: "flex-end" } }}
        >
          {submitting ? "Submitting…" : "Submit feedback"}
        </Button>
      </Stack>
    </Paper>
  );
}
