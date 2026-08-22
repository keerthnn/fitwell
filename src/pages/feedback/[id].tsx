import { Alert, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import AuthenticatedPage from "fitness/components/AuthenticatedPage";
import ConfirmDialog from "fitness/components/common/ConfirmDialog";
import ErrorState from "fitness/components/common/ErrorState";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import StatusChip from "fitness/components/common/StatusChip";
import FeedbackReplyComposer from "fitness/components/feedback/FeedbackReplyComposer";
import FeedbackThreadView from "fitness/components/feedback/FeedbackThreadView";
import { feedbackCategoryLabel } from "fitness/utils/feedback";
import {
  deleteFeedback,
  getFeedbackById,
  replyToFeedback,
} from "fitness/utils/spec";
import type { FeedbackThread } from "fitness/utils/types";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

export default function FeedbackDetailPage() {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : "";
  const [feedback, setFeedback] = useState<FeedbackThread>();
  const [error, setError] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [actionError, setActionError] = useState("");

  const load = useCallback(async () => {
    if (!id) return;
    await Promise.resolve();
    setError("");
    try {
      setFeedback(await getFeedbackById(id));
    } catch {
      setError("This feedback conversation could not be loaded.");
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    void getFeedbackById(id)
      .then((result) => {
        setError("");
        setFeedback(result);
      })
      .catch(() =>
        setError("This feedback conversation could not be loaded."),
      );
  }, [id]);

  return (
    <AuthenticatedPage>
      {error ? (
        <ErrorState message={error} onRetry={() => void load()} />
      ) : !feedback ? (
        <LoadingState />
      ) : (
        <>
          <PageHeader
            title={feedback.subject}
            description={`Started ${new Date(feedback.createdAt).toLocaleString()}`}
            backLink={{ label: "Back to feedback", href: "/feedback" }}
          />
          {feedback.canDelete && (
            <Button
              color="error"
              variant="outlined"
              onClick={() => setDeleteOpen(true)}
              sx={{ mb: 3 }}
            >
              Delete feedback
            </Button>
          )}
          {actionError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {actionError}
            </Alert>
          )}
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
              <StatusChip status={feedback.status} />
              <Chip
                size="small"
                variant="outlined"
                label={feedbackCategoryLabel(feedback.category)}
              />
              <Typography color="text.secondary" variant="body2">
                {feedback.status === "CLOSED"
                  ? "FitWell Support has closed this conversation."
                  : "Open means FitWell Support has a new message to review."}
              </Typography>
            </Stack>
          </Paper>
          <Stack gap={3}>
            <FeedbackThreadView
              messages={feedback.messages}
              viewerRole="USER"
            />
            {feedback.status === "CLOSED" ? (
              <Alert severity="info">
                This conversation is closed and no longer accepts replies.
              </Alert>
            ) : (
              <FeedbackReplyComposer
                onSubmit={async (message) => {
                  await replyToFeedback({ feedbackId: feedback.id, message });
                  await load();
                }}
                buttonLabel="Send follow-up"
              />
            )}
          </Stack>
          <ConfirmDialog
            open={deleteOpen}
            title="Delete this feedback?"
            description="This permanently removes the conversation. Feedback can only be deleted before FitWell Support replies."
            onCancel={() => setDeleteOpen(false)}
            onConfirm={async () => {
              try {
                setActionError("");
                await deleteFeedback(feedback.id);
                await router.push("/feedback");
              } catch {
                setDeleteOpen(false);
                setActionError(
                  "This feedback could not be deleted. FitWell Support may have replied.",
                );
                await load();
              }
            }}
          />
        </>
      )}
    </AuthenticatedPage>
  );
}
