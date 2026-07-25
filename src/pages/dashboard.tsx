import AuthenticatedPage from "fitness/components/AuthenticatedPage";
import ErrorState from "fitness/components/common/ErrorState";
import LoadingState from "fitness/components/common/LoadingState";
import DashboardContent from "fitness/components/dashboard/DashboardContent";
import { getDashboardSummary } from "fitness/utils/spec";
import type { DashboardSummary } from "fitness/utils/types";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary>();
  const [error, setError] = useState("");
  useEffect(() => {
    void getDashboardSummary()
      .then(setSummary)
      .catch(() => setError("Your dashboard could not be loaded."));
  }, []);
  return (
    <AuthenticatedPage>
      {error ? (
        <ErrorState message={error} onRetry={() => location.reload()} />
      ) : !summary ? (
        <LoadingState label="Loading dashboard" />
      ) : (
        <DashboardContent summary={summary} />
      )}
    </AuthenticatedPage>
  );
}
