import { Button, Paper, Stack, Typography } from "@mui/material";
import AdminLayout from "fitness/components/AdminLayout";
import ConfirmDialog from "fitness/components/common/ConfirmDialog";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import {
  adminDeleteUser,
  adminDisableUser,
  adminRestoreUser,
  getAdminUser,
} from "fitness/utils/spec";
import type { AdminUserDetail } from "fitness/utils/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function AdminUserPage() {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : "";
  const [user, setUser] = useState<AdminUserDetail>();
  const [confirmDelete, setConfirmDelete] = useState(false);
  useEffect(() => {
    if (id) void getAdminUser(id).then(setUser);
  }, [id]);
  return (
    <AdminLayout>
      {!user ? (
        <LoadingState />
      ) : (
        <>
          <PageHeader
            title={user.displayName ?? user.email}
            description="Account details, status, and administrative actions."
          />
          <Paper variant="outlined" sx={{ p: 3, maxWidth: 760 }}>
            <Stack gap={2}>
              <Stack gap={0.25}>
                <Typography variant="caption" color="text.secondary">
                  Email
                </Typography>
                <Typography fontWeight={700}>{user.email}</Typography>
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} gap={3}>
                <Stack gap={0.25}>
                  <Typography variant="caption" color="text.secondary">
                    Account status
                  </Typography>
                  <Typography fontWeight={700}>
                    {user.isDisabled ? "Disabled" : "Active"}
                  </Typography>
                </Stack>
                <Stack gap={0.25}>
                  <Typography variant="caption" color="text.secondary">
                    Local data
                  </Typography>
                  <Typography fontWeight={700}>
                    {user.deletedAt ? "Deleted" : "Available"}
                  </Typography>
                </Stack>
              </Stack>
              {!user.deletedAt && (
                <Button
                  color={user.isDisabled ? "success" : "warning"}
                  variant="outlined"
                  onClick={async () => {
                    if (user.isDisabled) await adminRestoreUser(id);
                    else await adminDisableUser(id);
                    setUser(await getAdminUser(id));
                  }}
                >
                  {user.isDisabled ? "Restore user" : "Disable user"}
                </Button>
              )}
              <Button
                color="error"
                variant="outlined"
                onClick={() => setConfirmDelete(true)}
              >
                Delete application account
              </Button>
            </Stack>
          </Paper>
          <ConfirmDialog
            open={confirmDelete}
            title="Delete application account?"
            description="This removes the local FitWell account and its data. It does not delete the Firebase identity."
            onCancel={() => setConfirmDelete(false)}
            onConfirm={async () => {
              await adminDeleteUser(id);
              await router.push("/system-admin/users");
            }}
          />
        </>
      )}
    </AdminLayout>
  );
}
