import { Add, Check, Close, FitnessCenter } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import FitWellImage from "fitness/components/common/FitWellImage";
import SearchInput from "fitness/components/common/SearchInput";
import { resolveExerciseImageCandidates } from "fitness/lib/images/assetRegistry";
import { getExercises } from "fitness/utils/spec";
import type { Exercise } from "fitness/utils/types";
import { useEffect, useState } from "react";

function ExerciseThumbnail({ exercise }: { exercise: Exercise }) {
  return (
    <Box
      sx={{
        width: 56,
        height: 52,
        borderRadius: 2,
        overflow: "hidden",
        flex: "0 0 auto",
      }}
    >
      <FitWellImage
        candidates={resolveExerciseImageCandidates(exercise)}
        alt={`${exercise.name} exercise illustration`}
        height="100%"
        objectFit="contain"
      />
    </Box>
  );
}

export default function WorkoutExercisePicker({
  selected,
  onChange,
  initialExercises,
  emptyDescription = "You can still start empty and add exercises during the workout.",
}: {
  selected: Exercise[];
  onChange: (exercises: Exercise[]) => void;
  initialExercises?: Exercise[];
  emptyDescription?: string;
}) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Exercise[] | undefined>(
    initialExercises,
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialExercises) return;
    const timeout = window.setTimeout(() => {
      void getExercises({
        limit: "12",
        ...(search ? { search } : {}),
      })
        .then((result) => {
          setError("");
          setResults(result.items);
        })
        .catch(() => {
          setError("Exercises could not be loaded.");
          setResults([]);
        });
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [initialExercises, search]);

  const selectedIds = new Set(selected.map((exercise) => exercise.id));

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 360px" },
        gap: 2,
        alignItems: "start",
      }}
    >
      <Paper variant="outlined" sx={{ overflow: "hidden" }}>
        <Box p={2}>
          <Typography variant="h6">Exercise catalogue</Typography>
          <Typography variant="body2" color="text.secondary" mb={1.5}>
            Search and add movements for this session.
          </Typography>
          <SearchInput
            value={search}
            onChange={setSearch}
            label="Search exercises"
          />
        </Box>
        <Divider />

        {results === undefined ? (
          <Box minHeight={220} display="grid" sx={{ placeItems: "center" }}>
            <Typography color="text.secondary">Loading exercises…</Typography>
          </Box>
        ) : error ? (
          <Box p={3} textAlign="center">
            <Typography color="error.main">{error}</Typography>
          </Box>
        ) : results.length === 0 ? (
          <Box p={3} textAlign="center">
            <Typography fontWeight={700}>No exercises found</Typography>
            <Typography variant="body2" color="text.secondary">
              Try another search term.
            </Typography>
          </Box>
        ) : (
          <Stack
            divider={<Divider flexItem />}
            sx={{ maxHeight: 430, overflowY: "auto" }}
          >
            {results.map((exercise) => {
              const isSelected = selectedIds.has(exercise.id);
              return (
                <Stack
                  key={exercise.id}
                  direction="row"
                  alignItems="center"
                  gap={1.5}
                  px={2}
                  py={1.25}
                >
                  <ExerciseThumbnail exercise={exercise} />
                  <Box minWidth={0} flex={1}>
                    <Typography fontWeight={700} noWrap>
                      {exercise.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      textTransform="capitalize"
                      noWrap
                    >
                      {exercise.primaryMuscle} ·{" "}
                      {exercise.equipment.toLowerCase()}
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    variant={isSelected ? "contained" : "outlined"}
                    startIcon={isSelected ? <Check /> : <Add />}
                    disabled={isSelected}
                    onClick={() => onChange([...selected, exercise])}
                  >
                    {isSelected ? "Added" : "Add"}
                  </Button>
                </Stack>
              );
            })}
          </Stack>
        )}
      </Paper>

      <Paper
        variant="outlined"
        sx={{
          overflow: "hidden",
          position: { md: "sticky" },
          top: { md: 24 },
        }}
      >
        <Box p={2}>
          <Stack direction="row" justifyContent="space-between" gap={2}>
            <Box>
              <Typography variant="h6">Selected exercises</Typography>
              <Typography variant="body2" color="text.secondary">
                {selected.length
                  ? `${selected.length} ${
                      selected.length === 1 ? "exercise" : "exercises"
                    } ready`
                  : "Add exercises from the catalogue"}
              </Typography>
            </Box>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                bgcolor: "action.selected",
                color: (theme) =>
                  theme.fitwell.colors.interaction.onPrimaryContainer,
                display: "grid",
                placeItems: "center",
                fontWeight: 800,
              }}
            >
              {selected.length}
            </Box>
          </Stack>
        </Box>

        <Divider />

        {selected.length === 0 ? (
          <Stack
            minHeight={220}
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            p={3}
            color="text.secondary"
          >
            <FitnessCenter sx={{ fontSize: 44, mb: 1 }} />
            <Typography fontWeight={700} color="text.primary">
              No exercises selected
            </Typography>
            <Typography variant="body2">
              {emptyDescription}
            </Typography>
          </Stack>
        ) : (
          <Stack
            divider={<Divider flexItem />}
            sx={{ maxHeight: 430, overflowY: "auto" }}
          >
            {selected.map((exercise, index) => (
              <Stack
                key={exercise.id}
                direction="row"
                alignItems="center"
                gap={1}
                px={2}
                py={1}
              >
                <Typography variant="caption" color="text.secondary" width={18}>
                  {index + 1}
                </Typography>
                <ExerciseThumbnail exercise={exercise} />
                <Box minWidth={0} flex={1}>
                  <Typography fontWeight={700} noWrap>
                    {exercise.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {exercise.primaryMuscle}
                  </Typography>
                </Box>
                <IconButton
                  aria-label={`Remove ${exercise.name}`}
                  onClick={() =>
                    onChange(selected.filter((item) => item.id !== exercise.id))
                  }
                >
                  <Close />
                </IconButton>
              </Stack>
            ))}
          </Stack>
        )}
      </Paper>
    </Box>
  );
}
