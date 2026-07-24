import { Paper } from "@mui/material";
import AdminLayout from "fitness/components/AdminLayout";
import PageHeader from "fitness/components/common/PageHeader";
import WorkoutPlanForm from "fitness/components/workout-plans/WorkoutPlanForm";
export default function NewAdminWorkoutPlanPage() {
  return (
    <AdminLayout>
      <PageHeader
        title="New built-in Workout Plan"
        description="Create a reusable training programme for FitWell users."
      />
      <Paper variant="outlined" sx={{ p: 3 }}>
        <WorkoutPlanForm admin />
      </Paper>
    </AdminLayout>
  );
}