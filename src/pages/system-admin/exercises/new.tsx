import { Paper } from "@mui/material";
import AdminLayout from "fitness/components/AdminLayout";
import ExerciseAdminForm from "fitness/components/admin/exercises/ExerciseAdminForm";
import PageHeader from "fitness/components/common/PageHeader";
export default function NewAdminExercisePage() {
  return (
    <AdminLayout>
      <PageHeader
        title="New exercise"
        description="Add a new exercise to the FitWell catalogue."
      />
      <Paper variant="outlined" sx={{ p: 3 }}>
        <ExerciseAdminForm />
      </Paper>
    </AdminLayout>
  );
}
