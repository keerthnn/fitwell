import { Paper } from "@mui/material";
import AuthenticatedPage from "fitness/components/AuthenticatedPage";
import PageHeader from "fitness/components/common/PageHeader";
import WorkoutCreateForm from "fitness/components/workouts/WorkoutCreateForm";

export default function QuickEntryPage() {
  return <AuthenticatedPage><PageHeader title="Quick entry" description="Record a completed or past workout." /><Paper sx={{ p: 4, maxWidth: 640 }}><WorkoutCreateForm mode="QUICK_ENTRY" /></Paper></AuthenticatedPage>;
}
