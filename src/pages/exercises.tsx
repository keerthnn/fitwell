import { Grid } from "@mui/material";
import AuthenticatedPage from "fitness/components/AuthenticatedPage";
import EmptyState from "fitness/components/common/EmptyState";
import ErrorState from "fitness/components/common/ErrorState";
import FilterToolbar from "fitness/components/common/FilterToolbar";
import LoadingState from "fitness/components/common/LoadingState";
import PageHeader from "fitness/components/common/PageHeader";
import SearchInput from "fitness/components/common/SearchInput";
import ExerciseCard from "fitness/components/exercises/ExerciseCard";
import { getExercises } from "fitness/utils/spec";
import type { Exercise } from "fitness/utils/types";
import { useEffect, useState } from "react";

export default function ExercisesPage() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<Exercise[]>();
  const [error, setError] = useState("");
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setError("");
      void getExercises(search ? { search } : undefined)
        .then((result) => setItems(result.items))
        .catch(() => setError("The exercise catalogue could not be loaded."));
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [search]);
  return (
    <AuthenticatedPage>
      <PageHeader title="Exercises" description="Browse the FitWell movement catalogue." />
      <FilterToolbar><SearchInput value={search} onChange={setSearch} label="Search exercises" /></FilterToolbar>
      {error ? <ErrorState message={error} /> : items === undefined ? <LoadingState /> : items.length === 0 ? (
        <EmptyState title="No exercises found" description="Try a different search." />
      ) : (
        <Grid container spacing={2}>
          {items.map((exercise) => <Grid key={exercise.id} size={{ xs: 12, sm: 6, lg: 4 }}><ExerciseCard exercise={exercise} /></Grid>)}
        </Grid>
      )}
    </AuthenticatedPage>
  );
}
