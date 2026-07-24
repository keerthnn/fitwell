import { ArrowForward } from "@mui/icons-material";
import { Box, Chip, Stack, Typography } from "@mui/material";
import AdminLayout from "fitness/components/AdminLayout";
import AdminDataList from "fitness/components/admin/layout/AdminDataList";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import { getExercises } from "fitness/utils/spec";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminExercisesPage() {
  const [items, setItems] = useState<Array<Record<string, unknown>>>();
  useEffect(() => {
    void getExercises({ limit: "100", includeInactive: "true" }).then(
      (result) =>
        setItems(result.items as unknown as Array<Record<string, unknown>>),
    );
  }, []);
  return (
    <AdminLayout>
      <PageHeader
        title="Exercises"
        description="Manage the exercise catalogue and availability."
        action={{
          label: "New exercise",
          href: "/system-admin/exercises/new",
        }}
      />
      {!items ? (
        <LoadingState />
      ) : (
        <AdminDataList
          items={items}
          empty="No exercises"
          render={(item) => (
            <Box
              component={Link}
              href={`/system-admin/exercises/${String(item.id)}`}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Stack minWidth={0}>
                <Typography fontWeight={700} noWrap>
                  {String(item.name)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {String(item.primaryMuscle)} · {String(item.equipment)}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" gap={1.5}>
                <Chip
                  size="small"
                  color={item.isActive ? "success" : "default"}
                  label={item.isActive ? "Active" : "Archived"}
                />
                <ArrowForward color="action" />
              </Stack>
            </Box>
          )}
        />
      )}
    </AdminLayout>
  );
}
