import { Stack, Typography } from "@mui/material";
import AdminLayout from "fitness/components/AdminLayout";
import AdminDataList from "fitness/components/admin/layout/AdminDataList";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import { getAdminAuditLogs } from "fitness/utils/spec";
import type { AdminAuditLogListItem } from "fitness/utils/types";
import { useEffect, useState } from "react";

export default function AuditLogsPage() {
  const [items, setItems] = useState<AdminAuditLogListItem[]>();
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
            return (
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                gap={0.5}
              >
                <Stack>
                  <Typography fontWeight={700}>
                    {item.action.replaceAll("_", " ")}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {item.entityType} ·{" "}
                    {item.admin.displayName ?? item.admin.email}
                  </Typography>
                </Stack>
                <Typography color="text.secondary" variant="body2">
                  {new Date(item.createdAt).toLocaleString()}
                </Typography>
              </Stack>
            );
          }}
        />
      )}
    </AdminLayout>
  );
}
