import { Typography } from "@mui/material";
import AdminLayout from "fitness/components/AdminLayout";
import AdminDataList from "fitness/components/admin/layout/AdminDataList";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import { getExercises } from "fitness/utils/spec";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminExercisesPage() {
  const [items, setItems] = useState<Array<Record<string, unknown>>>();
  useEffect(() => { void getExercises({ limit: "100", includeInactive: "true" }).then((result) => setItems(result.items as unknown as Array<Record<string, unknown>>)); }, []);
  return <AdminLayout><PageHeader title="Exercises" action={{ label: "New exercise", href: "/system-admin/exercises/new" }} />{!items ? <LoadingState /> : <AdminDataList items={items} empty="No exercises" render={(item) => <Typography component={Link} href={`/system-admin/exercises/${String(item.id)}`}>{String(item.name)}</Typography>} />}</AdminLayout>;
}
