import { Button, Stack } from "@mui/material";
import AdminLayout from "fitness/components/AdminLayout";
import EmptyState from "fitness/components/common/EmptyState";
import ErrorState from "fitness/components/common/ErrorState";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import FeedbackFilters from "fitness/components/feedback/FeedbackFilters";
import FeedbackList from "fitness/components/feedback/FeedbackList";
import { getAdminFeedback } from "fitness/utils/spec";
import type { AdminFeedbackListItem } from "fitness/utils/types";
import { useCallback, useEffect, useState } from "react";

export default function AdminFeedbackPage() {
  const [items, setItems] = useState<AdminFeedbackListItem[]>();
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);

  const load = useCallback(
    async (cursor?: string) => {
      if (cursor) setLoadingMore(true);
      else setItems(undefined);
      setError("");
      try {
        const result = await getAdminFeedback({
          ...(search ? { search } : {}),
          ...(category ? { category } : {}),
          ...(status ? { status } : {}),
          ...(cursor ? { cursor } : {}),
        });
        setItems((current) =>
          cursor ? [...(current ?? []), ...result.items] : result.items,
        );
        setNextCursor(result.nextCursor);
      } catch {
        setError("Feedback could not be loaded.");
      } finally {
        setLoadingMore(false);
      }
    },
    [category, search, status],
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => void load(), 250);
    return () => window.clearTimeout(timeout);
  }, [load]);

  return (
    <AdminLayout>
      <PageHeader
        title="Feedback"
        description="Review user issues and suggestions, then reply as FitWell Support."
      />
      <FeedbackFilters
        search={search}
        category={category}
        status={status}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onStatusChange={setStatus}
      />
      {error ? (
        <ErrorState message={error} onRetry={() => void load()} />
      ) : !items ? (
        <LoadingState />
      ) : items.length === 0 ? (
        <EmptyState
          title="No feedback found"
          description="There are no matching feedback conversations."
        />
      ) : (
        <Stack gap={2}>
          <FeedbackList items={items} hrefPrefix="/system-admin/feedback" />
          {nextCursor && (
            <Button
              variant="outlined"
              disabled={loadingMore}
              onClick={() => void load(nextCursor)}
              sx={{ alignSelf: "center" }}
            >
              {loadingMore ? "Loading…" : "Load more"}
            </Button>
          )}
        </Stack>
      )}
    </AdminLayout>
  );
}
