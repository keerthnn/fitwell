import { Alert, Paper } from "@mui/material";
import AdminLayout from "fitness/components/AdminLayout";
import PageHeader from "fitness/components/common/PageHeader";
export default function AdminSettingsPage() {
  return (
    <AdminLayout>
      <PageHeader
        title="Admin settings"
        description="Environment and administration configuration."
      />
      <Paper variant="outlined" sx={{ p: 2.5 }}>
        <Alert severity="info">
          FitWell is configured for local development only.
        </Alert>
      </Paper>
    </AdminLayout>
  );
}
