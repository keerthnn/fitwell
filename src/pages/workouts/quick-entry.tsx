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
        backLink={{ label: "Back to workouts", href: "/workouts" }}
      />
      <Paper
        variant="outlined"
        sx={{ p: { xs: 2, sm: 4 }, width: "100%", maxWidth: 640, mx: "auto" }}
      >
        <WorkoutCreateForm mode="QUICK_ENTRY" />
      </Paper>
    </AuthenticatedPage>
  );
}
