import { Button, Paper, Stack, Typography } from "@mui/material";
import AdminLayout from "fitness/components/AdminLayout";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import { adminDeleteUser, adminDisableUser, adminRestoreUser, getAdminUser } from "fitness/utils/spec";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function AdminUserPage() {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : "";
  const [user, setUser] = useState<Record<string, unknown>>();
  useEffect(() => { if (id) void getAdminUser(id).then(setUser); }, [id]);
  return <AdminLayout>{!user ? <LoadingState /> : <><PageHeader title={String(user.displayName ?? user.email)} /><Paper sx={{ p: 3 }}><Stack gap={2}><Typography>{String(user.email)}</Typography><Typography>Disabled: {String(user.isDisabled)}</Typography><Typography>Deleted: {String(Boolean(user.deletedAt))}</Typography>{!user.deletedAt && <Button color={user.isDisabled ? "success" : "warning"} onClick={async () => { if (user.isDisabled) await adminRestoreUser(id); else await adminDisableUser(id); setUser(await getAdminUser(id)); }}>{user.isDisabled ? "Restore user" : "Disable user"}</Button>}<Button color="error" onClick={async () => { if (!window.confirm("Delete this local application account?")) return; await adminDeleteUser(id); await router.push("/system-admin/users"); }}>Delete application account</Button></Stack></Paper></>}</AdminLayout>;
}
