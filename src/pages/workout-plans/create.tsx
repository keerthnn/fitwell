import { Paper } from "@mui/material";
import AuthenticatedPage from "fitness/components/AuthenticatedPage";
import PageHeader from "fitness/components/common/PageHeader";
import WorkoutPlanForm from "fitness/components/workout-plans/WorkoutPlanForm";

export default function CreateWorkoutPlanPage() {
  return <AuthenticatedPage><PageHeader title="Create Workout Plan" /><Paper sx={{ p: 4 }}><WorkoutPlanForm /></Paper></AuthenticatedPage>;
}
