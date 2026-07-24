import { Paper } from "@mui/material";
import AuthenticatedPage from "fitness/components/AuthenticatedPage";
import PageHeader from "fitness/components/common/PageHeader";
import WorkoutCreateForm from "fitness/components/workouts/WorkoutCreateForm";

export default function CreateWorkoutPage() {
  return (
    <AuthenticatedPage>
      <PageHeader
        title="Start a workout"
        description="Name the session now. You can add exercises and sets next."
      />
      <Paper sx={{ p: { xs: 2, sm: 4 }, maxWidth: 720 }}>
        <WorkoutCreateForm mode="LIVE" />
      </Paper>
    </AuthenticatedPage>
  );
}
