import { Alert, Button, Paper, Stack, TextField } from "@mui/material";
import { useState } from "react";

export default function FeedbackReplyComposer({
  onSubmit,
  buttonLabel = "Send reply",
}: {
  onSubmit: (message: string) => Promise<void>;
  buttonLabel?: string;
}) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function submit() {
    const content = message.trim();
    if (!content) {
      setError("Message is required.");
      return;
    }
    if (content.length > 4000) {
      setError("Message must be 4,000 characters or fewer.");
      return;
    }
    setError("");
    setSending(true);
    try {
      await onSubmit(content);
      setMessage("");
    } catch {
      setError("Your reply could not be sent. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack gap={2}>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Reply"
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
            if (error) setError("");
          }}
          multiline
          minRows={4}
          error={Boolean(error)}
          helperText={`${message.length.toLocaleString()} / 4,000`}
          slotProps={{ htmlInput: { maxLength: 4001 } }}
        />
        <Button
          variant="contained"
          onClick={() => void submit()}
          disabled={sending || !message.trim()}
          sx={{ alignSelf: { sm: "flex-end" } }}
        >
          {sending ? "Sending…" : buttonLabel}
        </Button>
      </Stack>
    </Paper>
  );
}
