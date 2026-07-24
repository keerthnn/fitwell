import { Grid } from "@mui/material";
import AdminLayout from "fitness/components/AdminLayout";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import StatCard from "fitness/components/common/StatCard";
import { getAdminSummary } from "fitness/utils/spec";
import { useEffect, useState } from "react";

export default function AdminOverviewPage() {
  const [summary, setSummary] = useState<Record<string, number>>();
  useEffect(() => { void getAdminSummary().then(setSummary); }, []);
  return <AdminLayout><PageHeader title="Admin overview" />{!summary ? <LoadingState /> : <Grid container spacing={2}>{Object.entries(summary).map(([label, value]) => <Grid key={label} size={{ xs: 12, sm: 6, lg: 3 }}><StatCard label={label.replaceAll(/([A-Z])/g, " $1")} value={value} /></Grid>)}</Grid>}</AdminLayout>;
}
