import { Paper } from "@mui/material";
import AuthenticatedPage from "fitness/components/AuthenticatedPage";
import PageHeader from "fitness/components/common/PageHeader";
import WorkoutCreateForm from "fitness/components/workouts/WorkoutCreateForm";

export default function CreateWorkoutPage() {
  return <AuthenticatedPage><PageHeader title="Start a workout" /><Paper sx={{ p: 4, maxWidth: 640 }}><WorkoutCreateForm mode="LIVE" /></Paper></AuthenticatedPage>;
}
