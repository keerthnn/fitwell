import { Paper } from "@mui/material";
import AuthenticatedPage from "fitness/components/AuthenticatedPage";
import PageHeader from "fitness/components/common/PageHeader";
import WorkoutPlanForm from "fitness/components/workout-plans/WorkoutPlanForm";

export default function CreateWorkoutPlanPage() {
  return (
    <AuthenticatedPage>
      <PageHeader
        title="Create Workout Plan"
        description="Build a reusable programme with clear exercise targets."
      />
      <Paper
        variant="outlined"
        sx={{ p: { xs: 2, sm: 4 }, maxWidth: 1180 }}
      >
        <WorkoutPlanForm />
      </Paper>
    </AuthenticatedPage>
  );
}
