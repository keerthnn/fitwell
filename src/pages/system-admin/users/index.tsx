import { Stack, Typography } from "@mui/material";
import AdminLayout from "fitness/components/AdminLayout";
import AdminDataList from "fitness/components/admin/layout/AdminDataList";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import { getAdminUsers } from "fitness/utils/spec";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [items, setItems] = useState<Array<Record<string, unknown>>>();
  useEffect(() => { void getAdminUsers().then((result) => setItems(result.items)); }, []);
  return <AdminLayout><PageHeader title="Users" />{!items ? <LoadingState /> : <AdminDataList items={items} empty="No users" render={(item) => <Stack><Typography component={Link} href={`/system-admin/users/${String(item.id)}`} fontWeight={700}>{String(item.displayName ?? item.email)}</Typography><Typography color="text.secondary">{String(item.email)}</Typography></Stack>} />}</AdminLayout>;
}
