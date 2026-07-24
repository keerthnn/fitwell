import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import AdminLayout from "fitness/components/AdminLayout";
import AdminDataList from "fitness/components/admin/layout/AdminDataList";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import {
  adminGrantAccess,
  adminRemoveAccess,
  getAdminAccessList,
} from "fitness/utils/spec";
import { useCallback, useEffect, useState } from "react";

export default function AdminAccessPage() {
  const [items, setItems] = useState<Array<Record<string, unknown>>>();
  const [userId, setUserId] = useState("");
  const load = useCallback(
    () => getAdminAccessList().then((result) => setItems(result.items)),
    [],
  );
  useEffect(() => {
    void load();
  }, [load]);
  return (
    <AdminLayout>
      <PageHeader
        title="Admin access"
        description="Grant or remove access to FitWell's administration tools."
      />
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
          <TextField
            label="Synchronized Firebase UID"
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
          />
          <Button
            variant="contained"
            disabled={!userId.trim()}
            onClick={async () => {
              await adminGrantAccess(userId.trim());
              setUserId("");
              await load();
            }}
            sx={{ minWidth: { sm: 160 } }}
          >
            Grant access
          </Button>
        </Stack>
      </Paper>
      {!items ? (
        <LoadingState />
      ) : (
        <AdminDataList
          items={items}
          empty="No admins"
          render={(item) => {
            const user = item.user as Record<string, unknown> | undefined;
            return (
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                gap={2}
              >
                <Stack minWidth={0}>
                  <Typography fontWeight={700} noWrap>
                    {String(user?.displayName ?? user?.email ?? item.userId)}
                  </Typography>
                  <Typography color="text.secondary" variant="body2" noWrap>
                    {String(user?.email ?? item.userId)}
                  </Typography>
                </Stack>
                <Button
                  color="error"
                  onClick={async () => {
                    await adminRemoveAccess(String(item.userId));
                    await load();
                  }}
                >
                  Remove
                </Button>
              </Stack>
            );
          }}
        />
      )}
    </AdminLayout>
  );
}
