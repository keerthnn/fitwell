import { ArrowForward } from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";
import AdminLayout from "fitness/components/AdminLayout";
import AdminDataList from "fitness/components/admin/layout/AdminDataList";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import { getAdminUsers } from "fitness/utils/spec";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [items, setItems] = useState<Array<Record<string, unknown>>>();
  useEffect(() => {
    void getAdminUsers().then((result) => setItems(result.items));
  }, []);
  return (
    <AdminLayout>
      <PageHeader
        title="Users"
        description="Review accounts, activity, and access status."
      />
      {!items ? (
        <LoadingState />
      ) : (
        <AdminDataList
          items={items}
          empty="No users"
          render={(item) => {
            const counts = item._count as Record<string, unknown> | undefined;
            return (
              <Box
                component={Link}
                href={`/system-admin/users/${String(item.id)}`}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Stack minWidth={0}>
                  <Typography fontWeight={700} noWrap>
                    {String(item.displayName ?? item.email)}
                  </Typography>
                  <Typography color="text.secondary" variant="body2" noWrap>
                    {String(item.email)}
                  </Typography>
                </Stack>
                <Stack direction="row" gap={2} alignItems="center">
                  <Typography
                    color="text.secondary"
                    variant="body2"
                    sx={{ display: { xs: "none", sm: "block" } }}
                  >
                    {String(counts?.workouts ?? 0)} workouts
                  </Typography>
                  <ArrowForward color="action" />
                </Stack>
              </Box>
            );
          }}
        />
      )}
    </AdminLayout>
  );
}
