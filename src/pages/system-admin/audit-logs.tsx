import { Stack, Typography } from "@mui/material";
import AdminLayout from "fitness/components/AdminLayout";
import AdminDataList from "fitness/components/admin/layout/AdminDataList";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import { getAdminAuditLogs } from "fitness/utils/spec";
import { useEffect, useState } from "react";

export default function AuditLogsPage() {
  const [items, setItems] = useState<Array<Record<string, unknown>>>();
  useEffect(() => { void getAdminAuditLogs().then((result) => setItems(result.items)); }, []);
  return <AdminLayout><PageHeader title="Audit logs" />{!items ? <LoadingState /> : <AdminDataList items={items} empty="No audit events" render={(item) => <Stack><Typography fontWeight={700}>{String(item.action)}</Typography><Typography color="text.secondary">{String(item.entityType)} · {String(item.createdAt)}</Typography></Stack>} />}</AdminLayout>;
}
