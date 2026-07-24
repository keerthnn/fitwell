import { Grid } from "@mui/material";
import AdminLayout from "fitness/components/AdminLayout";
import ErrorState from "fitness/components/common/ErrorState";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import StatCard from "fitness/components/common/StatCard";
import { getAdminSummary } from "fitness/utils/spec";
import { useEffect, useState } from "react";

export default function AdminOverviewPage() {
  const [summary, setSummary] = useState<Record<string, number>>();
  const [error, setError] = useState("");
  useEffect(() => {
    void getAdminSummary()
      .then(setSummary)
      .catch(() => setError("The admin overview could not be loaded."));
  }, []);
  return (
    <AdminLayout>
      <PageHeader
        title="Admin overview"
        description="Operational status for the local FitWell application."
      />
      {error ? (
        <ErrorState message={error} />
      ) : !summary ? (
        <LoadingState />
      ) : (
        <Grid container spacing={2}>
          {Object.entries(summary).map(([label, value]) => (
            <Grid key={label} size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                label={label.replaceAll(/([A-Z])/g, " $1")}
                value={value}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </AdminLayout>
  );
}
