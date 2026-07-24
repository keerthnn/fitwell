import { Paper } from "@mui/material";
import AdminLayout from "fitness/components/AdminLayout";
import ExerciseAdminForm from "fitness/components/admin/exercises/ExerciseAdminForm";
import PageHeader from "fitness/components/common/PageHeader";
export default function NewAdminExercisePage() { return <AdminLayout><PageHeader title="New exercise" /><Paper sx={{ p: 3 }}><ExerciseAdminForm /></Paper></AdminLayout>; }
