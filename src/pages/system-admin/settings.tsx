import { Alert } from "@mui/material";
import AdminLayout from "fitness/components/AdminLayout";
import PageHeader from "fitness/components/common/PageHeader";
export default function AdminSettingsPage() { return <AdminLayout><PageHeader title="Admin settings" /><Alert severity="info">FitWell is configured for local development only.</Alert></AdminLayout>; }
