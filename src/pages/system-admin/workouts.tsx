import { Button, Stack, Typography } from "@mui/material";
import AdminLayout from "fitness/components/AdminLayout";
import AdminDataList from "fitness/components/admin/layout/AdminDataList";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import { adminDeleteWorkout, getAdminWorkouts } from "fitness/utils/spec";
import { useCallback, useEffect, useState } from "react";

export default function AdminWorkoutsPage() {
  const [items, setItems] = useState<Array<Record<string, unknown>>>();
  const load = useCallback(() => getAdminWorkouts().then((result) => setItems(result.items)), []);
  useEffect(() => { void load(); }, [load]);
  return <AdminLayout><PageHeader title="Workouts" description="Support view. User workout sets are read-only." />{!items ? <LoadingState /> : <AdminDataList items={items} empty="No workouts" render={(item) => <Stack direction="row" justifyContent="space-between" alignItems="center"><Stack><Typography fontWeight={700}>{String(item.name)}</Typography><Typography color="text.secondary">{String(item.status)}</Typography></Stack><Button color="error" onClick={async () => { await adminDeleteWorkout(String(item.id)); await load(); }}>Delete</Button></Stack>} />}</AdminLayout>;
}
