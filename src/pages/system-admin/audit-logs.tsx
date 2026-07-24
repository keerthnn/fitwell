import { Stack, Typography } from "@mui/material";
import AdminLayout from "fitness/components/AdminLayout";
import AdminDataList from "fitness/components/admin/layout/AdminDataList";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import { getAdminAuditLogs } from "fitness/utils/spec";
import { useEffect, useState } from "react";

export default function AuditLogsPage() {
  const [items, setItems] = useState<Array<Record<string, unknown>>>();
  useEffect(() => {
    void getAdminAuditLogs().then((result) => setItems(result.items));
  }, []);
  return (
    <AdminLayout>
      <PageHeader
        title="Audit logs"
        description="A chronological record of administrative changes."
      />
      {!items ? (
        <LoadingState />
      ) : (
        <AdminDataList
          items={items}
          empty="No audit events"
          render={(item) => {
            const admin = item.admin as Record<string, unknown> | undefined;
            return (
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                gap={0.5}
              >
                <Stack>
                  <Typography fontWeight={700}>
                    {String(item.action).replaceAll("_", " ")}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {String(item.entityType)} ·{" "}
                    {String(admin?.displayName ?? admin?.email ?? "System")}
                  </Typography>
                </Stack>
                <Typography color="text.secondary" variant="body2">
                  {new Date(String(item.createdAt)).toLocaleString()}
                </Typography>
              </Stack>
            );
          }}
        />
      )}
    </AdminLayout>
  );
}
