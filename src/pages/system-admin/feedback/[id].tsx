import { Alert, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import AdminLayout from "fitness/components/AdminLayout";
import ConfirmDialog from "fitness/components/common/ConfirmDialog";
import ErrorState from "fitness/components/common/ErrorState";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import StatusChip from "fitness/components/common/StatusChip";
import FeedbackReplyComposer from "fitness/components/feedback/FeedbackReplyComposer";
import FeedbackThreadView from "fitness/components/feedback/FeedbackThreadView";
import { feedbackCategoryLabel } from "fitness/utils/feedback";
import {
  adminCloseFeedback,
  adminReplyToFeedback,
  getAdminFeedbackById,
} from "fitness/utils/spec";
import type { AdminFeedbackThread } from "fitness/utils/types";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

export default function AdminFeedbackDetailPage() {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : "";
  const [feedback, setFeedback] = useState<AdminFeedbackThread>();
  const [error, setError] = useState("");
  const [closeOpen, setCloseOpen] = useState(false);
  const [actionError, setActionError] = useState("");

  const load = useCallback(async () => {
    if (!id) return;
    await Promise.resolve();
    setError("");
    try {
      setFeedback(await getAdminFeedbackById(id));
    } catch {
      setError("This feedback conversation could not be loaded.");
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    void getAdminFeedbackById(id)
      .then((result) => {
        setError("");
        setFeedback(result);
      })
      .catch(() =>
        setError("This feedback conversation could not be loaded."),
      );
  }, [id]);

  return (
    <AdminLayout>
      {error ? (
        <ErrorState message={error} onRetry={() => void load()} />
      ) : !feedback ? (
        <LoadingState />
      ) : (
        <>
          <PageHeader
            title={feedback.subject}
            description={`Submitted by ${feedback.user.displayName ?? feedback.user.email}`}
            backLink={{
              label: "Back to feedback queue",
              href: "/system-admin/feedback",
            }}
          />
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Stack gap={1}>
              <Stack direction="row" gap={1} flexWrap="wrap">
                <StatusChip status={feedback.status} />
                <Chip
                  size="small"
                  variant="outlined"
                  label={feedbackCategoryLabel(feedback.category)}
                />
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {feedback.user.email} · Started{" "}
                {new Date(feedback.createdAt).toLocaleString()}
              </Typography>
              {feedback.status !== "CLOSED" && (
                <Button
                  variant="outlined"
                  color="warning"
                  onClick={() => setCloseOpen(true)}
                  sx={{ alignSelf: "flex-start" }}
                >
                  Close feedback
                </Button>
              )}
            </Stack>
          </Paper>
          {actionError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {actionError}
            </Alert>
          )}
          <Stack gap={3}>
            <FeedbackThreadView
              messages={feedback.messages}
              viewerRole="ADMIN"
              userLabel={feedback.user.displayName ?? feedback.user.email}
            />
            {feedback.status === "CLOSED" ? (
              <Alert severity="info">
                This feedback is closed and no longer accepts replies.
              </Alert>
            ) : (
              <FeedbackReplyComposer
                onSubmit={async (message) => {
                  await adminReplyToFeedback({
                    feedbackId: feedback.id,
                    message,
                  });
                  await load();
                }}
                buttonLabel="Reply as FitWell Support"
              />
            )}
          </Stack>
          <ConfirmDialog
            open={closeOpen}
            title="Close this feedback?"
            description="Closing ends the conversation for both the user and FitWell Support. It cannot be reopened."
            onCancel={() => setCloseOpen(false)}
            onConfirm={async () => {
              try {
                setActionError("");
                await adminCloseFeedback(feedback.id);
                setCloseOpen(false);
                await load();
              } catch {
                setCloseOpen(false);
                setActionError("This feedback could not be closed.");
              }
            }}
          />
        </>
      )}
    </AdminLayout>
  );
}
