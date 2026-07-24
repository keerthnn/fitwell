import { Grid } from "@mui/material";
import AdminLayout from "fitness/components/AdminLayout";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import StatCard from "fitness/components/common/StatCard";
import { getAdminAnalytics } from "fitness/utils/spec";
import { useEffect, useState } from "react";

export default function AdminAnalyticsPage() {
  const [summary, setSummary] = useState<Record<string, number>>();
  useEffect(() => { void getAdminAnalytics().then(setSummary); }, []);
  return <AdminLayout><PageHeader title="Analytics" />{!summary ? <LoadingState /> : <Grid container spacing={2}>{Object.entries(summary).map(([label, value]) => <Grid key={label} size={{ xs: 12, md: 4 }}><StatCard label={label} value={value} /></Grid>)}</Grid>}</AdminLayout>;
}
