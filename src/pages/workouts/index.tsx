import { MenuItem, TextField } from "@mui/material";
import AuthenticatedPage from "fitness/components/AuthenticatedPage";
import EmptyState from "fitness/components/common/EmptyState";
import ErrorState from "fitness/components/common/ErrorState";
import FilterToolbar from "fitness/components/common/FilterToolbar";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import SearchInput from "fitness/components/common/SearchInput";
import WorkoutList from "fitness/components/workouts/WorkoutList";
import { getWorkouts } from "fitness/utils/spec";
import type { WorkoutListItem } from "fitness/utils/types";
import { useEffect, useState } from "react";

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<WorkoutListItem[]>();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setError("");
      const params = {
        ...(search ? { search } : {}),
        ...(status ? { status } : {}),
      };
      void getWorkouts(params)
        .then((result) => setWorkouts(result.items))
        .catch(() => setError("Your workouts could not be loaded."));
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [search, status]);
  return (
    <AuthenticatedPage>
      <PageHeader
        title="Workouts"
        description="Your training history, drafts, and active sessions."
        action={{ label: "Start workout", href: "/workouts/create" }}
      />
      <FilterToolbar>
        <SearchInput
          value={search}
          onChange={setSearch}
          label="Search workouts"
        />
        <TextField
          select
          label="Status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          sx={{ minWidth: { sm: 180 } }}
        >
          <MenuItem value="">All statuses</MenuItem>
          <MenuItem value="IN_PROGRESS">In progress</MenuItem>
          <MenuItem value="COMPLETED">Completed</MenuItem>
          <MenuItem value="DRAFT">Draft</MenuItem>
        </TextField>
      </FilterToolbar>
      {error ? (
        <ErrorState message={error} />
      ) : !workouts ? (
        <LoadingState />
      ) : workouts.length === 0 ? (
        <EmptyState
          title="No workouts found"
          description="Start a live workout, add a quick entry, or change your filters."
        />
      ) : (
        <WorkoutList
          workouts={workouts}
          onDeleted={(id) =>
            setWorkouts((current) =>
              current?.filter((workout) => workout.id !== id),
            )
          }
        />
      )}
    </AuthenticatedPage>
  );
}
