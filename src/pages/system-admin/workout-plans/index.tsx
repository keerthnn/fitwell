import { Typography } from "@mui/material";
import AdminLayout from "fitness/components/AdminLayout";
import AdminDataList from "fitness/components/admin/layout/AdminDataList";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import { listWorkoutPlans } from "fitness/utils/spec";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminWorkoutPlansPage() {
  const [items, setItems] = useState<Array<Record<string, unknown>>>();
  useEffect(() => { void listWorkoutPlans({ includeArchived: "true" }).then((result) => setItems(result.items.filter((item) => item.isBuiltIn) as unknown as Array<Record<string, unknown>>)); }, []);
  return <AdminLayout><PageHeader title="Workout Plans" action={{ label: "New built-in plan", href: "/system-admin/workout-plans/new" }} />{!items ? <LoadingState /> : <AdminDataList items={items} empty="No built-in Workout Plans" render={(item) => <Typography component={Link} href={`/system-admin/workout-plans/${String(item.id)}`}>{String(item.name)}</Typography>} />}</AdminLayout>;
}
