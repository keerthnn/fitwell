import { Paper } from "@mui/material";
import AuthenticatedPage from "fitness/components/AuthenticatedPage";
import PageHeader from "fitness/components/common/PageHeader";
import WorkoutCreateForm from "fitness/components/workouts/WorkoutCreateForm";

export default function CreateWorkoutPage() {
  return (
    <AuthenticatedPage>
      <PageHeader
        title="Start a workout"
        description="Set up the session and choose exercises before you begin."
        action={{ label: "Choose a workout plan", href: "/workout-plans" }}
      />
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 4 }, maxWidth: 1180 }}>
        <WorkoutCreateForm mode="LIVE" />
      </Paper>
    </AuthenticatedPage>
  );
}
