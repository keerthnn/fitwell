import { Button, Stack } from "@mui/material";
import AuthenticatedPage from "fitness/components/AuthenticatedPage";
import EmptyState from "fitness/components/common/EmptyState";
import ErrorState from "fitness/components/common/ErrorState";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import FeedbackCreateForm from "fitness/components/feedback/FeedbackCreateForm";
import FeedbackFilters from "fitness/components/feedback/FeedbackFilters";
import FeedbackList from "fitness/components/feedback/FeedbackList";
import { getFeedback } from "fitness/utils/spec";
import type { FeedbackListItem } from "fitness/utils/types";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

export default function FeedbackPage() {
  const router = useRouter();
  const [items, setItems] = useState<FeedbackListItem[]>();
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
        const result = await getFeedback({
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
        setError("Your feedback could not be loaded.");
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
    <AuthenticatedPage>
      <PageHeader
        title="Feedback"
        description="Share an issue or idea and continue the conversation with FitWell Support."
      />
      <FeedbackCreateForm
        onCreated={(id) => router.push(`/feedback/${id}`).then(() => undefined)}
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
          description="Submit feedback above or change your filters."
        />
      ) : (
        <Stack gap={2}>
          <FeedbackList items={items} hrefPrefix="/feedback" />
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
    </AuthenticatedPage>
  );
}
