import type {
  FeedbackAuthorRole,
  FeedbackMessage,
} from "fitness/utils/types";
import { Paper, Stack, Typography } from "@mui/material";

export default function FeedbackThreadView({
  messages,
  viewerRole,
  userLabel = "User",
}: {
  messages: FeedbackMessage[];
  viewerRole: FeedbackAuthorRole;
  userLabel?: string;
}) {
  return (
    <Stack gap={2} aria-label="Feedback conversation">
      {messages.map((message) => {
        const isViewer = message.authorRole === viewerRole;
        const label =
          message.authorRole === "ADMIN"
            ? "FitWell Support"
            : viewerRole === "USER"
              ? "You"
              : userLabel;
        return (
          <Paper
            key={message.id}
            variant="outlined"
            sx={{
              p: 2,
              width: "fit-content",
              maxWidth: { xs: "92%", sm: "78%" },
              alignSelf: isViewer ? "flex-end" : "flex-start",
              bgcolor: isViewer ? "primary.main" : "background.paper",
              color: isViewer ? "primary.contrastText" : "text.primary",
            }}
          >
            <Typography variant="caption" fontWeight={800} display="block">
              {label}
            </Typography>
            <Typography sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
              {message.content}
            </Typography>
            <Typography
              variant="caption"
              display="block"
              mt={1}
              sx={{ opacity: 0.75 }}
            >
              {new Date(message.createdAt).toLocaleString()}
            </Typography>
          </Paper>
        );
      })}
    </Stack>
  );
}
