import { Alert, Button, Paper, Stack, Typography } from "@mui/material";
import AuthenticatedPage from "fitness/components/AuthenticatedPage";
import ConfirmDialog from "fitness/components/common/ConfirmDialog";
import PageHeader from "fitness/components/common/PageHeader";
import { signOutUser } from "fitness/lib/authUtils";
import { deleteAccount } from "fitness/utils/spec";
import { useRouter } from "next/router";
import { useState } from "react";

export default function SettingsPage() {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  return (
    <AuthenticatedPage>
      <PageHeader title="Settings" />
      <Stack gap={3} maxWidth={720}>
        <Paper variant="outlined" sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack gap={2} alignItems="flex-start">
            <Typography variant="h6">Session</Typography>
            <Typography color="text.secondary">
              Sign out of FitWell on this device.
            </Typography>
            <Button
              color="error"
              variant="outlined"
              onClick={() => void signOutUser().then(() => router.push("/"))}
            >
              Sign out
            </Button>
          </Stack>
        </Paper>
        <Paper
          variant="outlined"
          sx={{ p: { xs: 3, sm: 4 }, borderColor: "error.main" }}
        >
          <Stack gap={2} alignItems="flex-start">
            <Typography variant="h6" color="error">
              Delete application account
            </Typography>
            <Alert severity="warning" sx={{ width: "100%" }}>
              This removes your local FitWell data and disables the application
              account. Your Firebase identity is preserved.
            </Alert>
            <Button
              color="error"
              variant="outlined"
              onClick={() => setConfirmOpen(true)}
            >
              Delete application account
            </Button>
          </Stack>
        </Paper>
      </Stack>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete application account?"
        description="Your local workouts, plans, and profile will be removed. This cannot be undone."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={async () => {
          await deleteAccount();
          await signOutUser();
          await router.replace("/");
        }}
      />
    </AuthenticatedPage>
  );
}
