import { Add, Check } from "fitness/components/common/icons";
import FitWellImage from "fitness/components/common/FitWellImage";
import { resolveExerciseImageCandidates } from "fitness/lib/images/assetRegistry";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { getExercises } from "fitness/utils/spec";
import type { Exercise, ExerciseListQuery } from "fitness/utils/types";
import type { MuscleGroup } from "fitness/utils/exerciseDiscovery";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MuscleBodyDiagram, { type BodyView } from "./MuscleBodyDiagram";
import EquipmentFilter from "fitness/components/exercise-discovery/EquipmentFilter";

type DiscoveryMode = "prompt" | "muscles" | "all";

export default function ExerciseDiscovery({
  selectedExerciseIds,
  onAdd,
  disabled = false,
}: {
  selectedExerciseIds: string[];
  onAdd: (exercise: Exercise) => void | Promise<void>;
  disabled?: boolean;
}) {
  const [mode, setMode] = useState<DiscoveryMode>("prompt");
  const [view, setView] = useState<BodyView>("front");
  const [groups, setGroups] = useState<MuscleGroup[]>([]);
  const [search, setSearch] = useState("");
  const [equipment, setEquipment] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [items, setItems] = useState<Exercise[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<"initial" | "page" | null>(null);
  const requestGeneration = useRef(0);
  const controller = useRef<AbortController | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setDebouncedSearch(search.trim()),
      250,
    );
    return () => window.clearTimeout(timeout);
  }, [search]);

  const sortedGroups = useMemo(() => [...groups].sort(), [groups]);
  const criteriaKey = `${mode}|${sortedGroups.join(",")}|${search.trim()}|${equipment}`;
  const waitingForSearch = search.trim() !== debouncedSearch;

  const request = useCallback(
    async (cursor?: string, append = false) => {
      if (mode === "prompt") return;
      const generation = ++requestGeneration.current;
      controller.current?.abort();
      const nextController = new AbortController();
      controller.current = nextController;
      if (append) setIsLoadingMore(true);
      else setIsLoading(true);
      setError(null);
      const params: ExerciseListQuery = {
        ...(mode === "muscles"
          ? { categories: sortedGroups.join(",") }
          : {}),
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
        ...(equipment ? { equipment } : {}),
        limit: "24",
        ...(cursor ? { cursor } : {}),
      };
      try {
        const result = await getExercises(params, {
          signal: nextController.signal,
        });
        if (generation !== requestGeneration.current) return;
        setItems((current) => {
          const combined = append ? [...current, ...result.items] : result.items;
          return [...new Map(combined.map((item) => [item.id, item])).values()];
        });
        setNextCursor(result.nextCursor);
      } catch {
        if (generation !== requestGeneration.current) return;
        setError(append ? "page" : "initial");
        if (!append) {
          setItems([]);
          setNextCursor(null);
        }
      } finally {
        if (generation === requestGeneration.current) {
          if (append) setIsLoadingMore(false);
          else setIsLoading(false);
        }
      }
    },
    [debouncedSearch, mode, sortedGroups, equipment],
  );

  useEffect(() => {
    requestGeneration.current += 1;
    controller.current?.abort();
    setItems([]);
    setNextCursor(null);
    setError(null);
    setIsLoading(false);
    setIsLoadingMore(false);
    if (mode !== "prompt" && !waitingForSearch) void request();
    return () => {
      requestGeneration.current += 1;
      controller.current?.abort();
    };
  }, [criteriaKey, mode, request, waitingForSearch]);

  function toggleGroup(group: MuscleGroup) {
    setGroups((current) => {
      const base = mode === "all" ? [] : current;
      const next = base.includes(group)
        ? base.filter((item) => item !== group)
        : [...base, group];
      setMode(next.length ? "muscles" : "prompt");
      return next;
    });
  }

  const selectedSet = new Set(selectedExerciseIds);

  return (
    <Stack gap={2}>
      <Paper variant="outlined" sx={{ p: { xs: 1.5, sm: 2 } }}>
        <Stack gap={2}>
          <Box>
            <Typography variant="h6">Choose muscles</Typography>
            <Typography variant="body2" color="text.secondary">
              Select one or more muscles to find matching exercises, or browse the full catalogue.
            </Typography>
          </Box>
          <MuscleBodyDiagram
            selected={groups}
            view={view}
            onViewChange={setView}
            onToggle={toggleGroup}
          />
          <EquipmentFilter value={equipment} onChange={setEquipment} />
          <Stack direction={{ xs: "column", sm: "row" }} gap={1}>
            <Button
              variant="outlined"
              onClick={() => {
                setGroups([]);
                setMode("prompt");
              }}
              disabled={!groups.length && mode !== "all"}
            >
              Clear muscles
            </Button>
            <Button
              variant={mode === "all" ? "contained" : "outlined"}
              onClick={() => {
                setGroups([]);
                setMode("all");
              }}
            >
              Browse all exercises
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {mode === "prompt" ? (
        <Paper variant="outlined" sx={{ p: 3, textAlign: "center" }}>
          <Typography fontWeight={700}>Select one or more muscles</Typography>
          <Typography variant="body2" color="text.secondary">
            Results appear after a muscle selection. You can also browse all exercises.
          </Typography>
        </Paper>
      ) : (
        <Paper variant="outlined" sx={{ overflow: "hidden" }}>
          <Box p={2}>
            <TextField
              fullWidth
              label="Search matching exercises"
              value={search}
              inputProps={{ maxLength: 120 }}
              onChange={(event) => setSearch(event.target.value)}
            />
          </Box>
          <Divider />
          <Box aria-live="polite" sx={{ minHeight: 120 }}>
            {isLoading || waitingForSearch ? (
              <Stack alignItems="center" gap={1} p={4}>
                <CircularProgress size={28} />
                <Typography color="text.secondary">Loading exercises…</Typography>
              </Stack>
            ) : error === "initial" ? (
              <Stack alignItems="center" gap={1.5} p={3}>
                <Alert severity="error">Exercises could not be loaded.</Alert>
                <Button onClick={() => void request()}>Retry</Button>
              </Stack>
            ) : items.length === 0 ? (
              <Box p={3} textAlign="center">
                <Typography fontWeight={700}>No matching exercises</Typography>
                <Typography variant="body2" color="text.secondary">
                  Try another muscle, equipment option, or search term.
                </Typography>
              </Box>
            ) : (
              <Stack divider={<Divider flexItem />}>
                {items.map((exercise) => {
                  const selected = selectedSet.has(exercise.id);
                  return (
                    <Stack
                      key={exercise.id}
                      direction="row"
                      alignItems="center"
                      gap={1.5}
                      px={2}
                      py={1.25}
                    >
                      <Box sx={{ width: { xs: 64, sm: 96 }, flexShrink: 0, borderRadius: 1.5, overflow: "hidden" }}>
                        <FitWellImage
                          candidates={resolveExerciseImageCandidates(exercise)}
                          alt={`${exercise.name} exercise illustration`}
                        />
                      </Box>
                      <Box minWidth={0} flex={1}>
                        <Typography fontWeight={700} sx={{ overflowWrap: "anywhere" }}>{exercise.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {exercise.primaryMuscle} · {exercise.equipment.toLowerCase()}
                        </Typography>
                      </Box>
                      <Button
                        sx={{ flexShrink: 0 }}
                        size="small"
                        variant={selected ? "contained" : "outlined"}
                        startIcon={selected ? <Check /> : <Add />}
                        aria-label={`${selected ? "Added" : "Add"} ${exercise.name}`}
                        disabled={selected || disabled}
                        onClick={() => void onAdd(exercise)}
                      >
                        {selected ? "Added" : "Add"}
                      </Button>
                    </Stack>
                  );
                })}
              </Stack>
            )}
          </Box>
          {items.length > 0 && (
            <Stack alignItems="center" gap={1} p={2}>
              {error === "page" && (
                <Alert severity="error">More exercises could not be loaded.</Alert>
              )}
              {nextCursor && (
                <Button
                  disabled={isLoadingMore}
                  onClick={() => void request(nextCursor, true)}
                >
                  {isLoadingMore ? "Loading more…" : error === "page" ? "Retry" : "Load more"}
                </Button>
              )}
            </Stack>
          )}
        </Paper>
      )}
    </Stack>
  );
}
