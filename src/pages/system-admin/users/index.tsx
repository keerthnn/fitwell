import { ArrowForward } from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";
import AdminLayout from "fitness/components/AdminLayout";
import AdminDataList from "fitness/components/admin/layout/AdminDataList";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import { getAdminUsers } from "fitness/utils/spec";
import type { AdminUserListItem } from "fitness/utils/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [items, setItems] = useState<AdminUserListItem[]>();
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
            return (
              <Box
                component={Link}
                href={`/system-admin/users/${item.id}`}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Stack minWidth={0}>
                  <Typography fontWeight={700} noWrap>
                    {item.displayName ?? item.email}
                  </Typography>
                  <Typography color="text.secondary" variant="body2" noWrap>
                    {item.email}
                  </Typography>
                </Stack>
                <Stack direction="row" gap={2} alignItems="center">
                  <Typography
                    color="text.secondary"
                    variant="body2"
                    sx={{ display: { xs: "none", sm: "block" } }}
                  >
                    {item._count.workouts} workouts
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
