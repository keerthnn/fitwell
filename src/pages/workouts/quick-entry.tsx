import { Paper } from "@mui/material";
import AuthenticatedPage from "fitness/components/AuthenticatedPage";
import PageHeader from "fitness/components/common/PageHeader";
import WorkoutCreateForm from "fitness/components/workouts/WorkoutCreateForm";

export default function QuickEntryPage() {
  return (
    <AuthenticatedPage>
      <PageHeader
        title="Quick entry"
        description="Create a past-workout draft, then add exercises and complete it."
      />
      <Paper variant="outlined" sx={{ p: 4, maxWidth: 640 }}>
        <WorkoutCreateForm mode="QUICK_ENTRY" />
      </Paper>
    </AuthenticatedPage>
  );
}
