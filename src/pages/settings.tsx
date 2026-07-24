import { Alert, Button, Divider, Paper, Stack, Typography } from "@mui/material";
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
      <Paper sx={{ p: 4, maxWidth: 720 }}>
        <Stack gap={3}>
          <Typography variant="h6">Session</Typography>
          <Button variant="outlined" onClick={() => void signOutUser().then(() => router.push("/"))}>Sign out</Button>
          <Divider />
          <Typography variant="h6" color="error">Delete application account</Typography>
          <Alert severity="warning">This removes your local FitWell data and disables the application account. Your Firebase identity is preserved.</Alert>
          <Button color="error" variant="outlined" onClick={() => setConfirmOpen(true)}>Delete application account</Button>
        </Stack>
      </Paper>
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
