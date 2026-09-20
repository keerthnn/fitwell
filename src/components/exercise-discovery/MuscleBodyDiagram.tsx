import { Box, Button, ButtonGroup, Stack, Typography } from "@mui/material";
import { muscleGroups, type MuscleGroup } from "fitness/utils/exerciseDiscovery";
import BodyFigure, { BodyFigureBoundary } from "fitness/components/exercise-discovery/BodyFigure";

export type BodyView = "front" | "back";

export default function MuscleBodyDiagram({ selected, view, onViewChange, onToggle }: {
  selected: MuscleGroup[];
  view: BodyView;
  onViewChange: (view: BodyView) => void;
  onToggle: (group: MuscleGroup) => void;
}) {
  const selectedSet = new Set(selected);

  return (
    <Stack gap={2} sx={{ containerType: "inline-size" }}>
      <Box sx={{
        bgcolor: "#22252b", color: "#f1f5f9", borderRadius: 3,
        border: "1px solid #3b424d", overflow: "hidden",
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}
          sx={{ px: 2, py: 1.5, borderBottom: "1px solid #3b424d" }}>
          <Typography variant="overline" sx={{ letterSpacing: "0.14em", color: "#b5c2d5" }}>
            Muscle map
          </Typography>
          <Typography variant="caption" sx={{ color: "#93c5fd", fontWeight: 700 }}>
            {selected.length ? `${selected.length} selected` : "Select your focus"}
          </Typography>
        </Stack>
        <Typography variant="body2" textAlign="center" sx={{ px: 2, pt: 2.5, color: "#c3ccd9" }}>
          Tap the muscles you want to train.
        </Typography>
        <ButtonGroup aria-label="Body view" fullWidth sx={{
          px: 2, pt: 2, boxSizing: "border-box", "@container (min-width: 480px)": { display: "none" },
          "& .MuiButton-root": { color: "#e2e8f0", borderColor: "#64748b", minHeight: 44 },
        }}>
          {(["front", "back"] as const).map((side) => (
            <Button key={side} variant={view === side ? "contained" : "outlined"}
              aria-pressed={view === side} onClick={() => onViewChange(side)}>
              {side === "front" ? "Front view" : "Back view"}
            </Button>
          ))}
        </ButtonGroup>
        <Box sx={{
          display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 2, px: 2, pt: 2, pb: 3,
          "@container (min-width: 480px)": { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" },
          "& .muscle-region": { cursor: "pointer", outline: "none" },
          "& .muscle-region path": { transition: "fill 150ms ease" },
          "@media (hover: hover) and (pointer: fine)": {
            "& .muscle-region:hover path": { fill: "#60a5fa" },
          },
          "& .muscle-region:focus-visible path": { stroke: "#facc15", strokeWidth: 3 },
          "@media (prefers-reduced-motion: reduce)": { "& .muscle-region path": { transition: "none" } },
        }}>
          {(["front", "back"] as const).map((side) => (
            <Box key={side} sx={{
              display: view === side ? "flex" : "none", flexDirection: "column", alignItems: "center", minWidth: 0,
              "@container (min-width: 480px)": { display: "flex" },
            }}>
              <BodyFigureBoundary>
                <BodyFigure side={side} selected={selected} onToggle={onToggle} />
              </BodyFigureBoundary>
              <Typography variant="caption" sx={{ color: "#b5c2d5", letterSpacing: "0.18em", mt: 1 }}>
                {side === "front" ? "FRONT" : "BACK"}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle2">Muscle groups</Typography>
        <Typography variant="caption" color="text.secondary">Select multiple</Typography>
      </Stack>
      <Box aria-label="Labeled muscle controls" sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {muscleGroups.map((group) => {
          const isSelected = selectedSet.has(group);
          return (
            <Button key={group} size="small" variant={isSelected ? "contained" : "outlined"}
              aria-pressed={isSelected} onClick={() => onToggle(group)}
              sx={{ borderRadius: 8, minHeight: 44, px: 1.75 }}>
              {isSelected && <Box component="span" aria-hidden="true" sx={{ mr: 0.75 }}>✓</Box>}
              {group}
            </Button>
          );
        })}
      </Box>
      <Typography variant="body2" fontWeight={700} aria-live="polite">
        {selected.length ? `Selected muscles: ${selected.join(", ")}` : "No muscles selected"}
      </Typography>
    </Stack>
  );
}
