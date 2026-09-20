import { Box, ButtonBase, Stack, Tooltip, Typography } from "@mui/material";
import { Check, Dashboard } from "fitness/components/common/icons";
import FitWellImage from "fitness/components/common/FitWellImage";
import { resolveEquipmentImageCandidates } from "fitness/lib/images/assetRegistry";
import type { EquipmentType } from "fitness/utils/exerciseDiscovery";

const options = [
  ["", "All equipment"],
  ["BARBELL", "Barbell"],
  ["DUMBBELL", "Dumbbell"],
  ["KETTLEBELL", "Kettlebell"],
  ["MACHINE", "Machine"],
  ["BODYWEIGHT", "Bodyweight"],
  ["CABLE", "Cable"],
] as const;

export default function EquipmentFilter({ value, onChange }: {
  value: EquipmentType[];
  onChange: (value: EquipmentType[]) => void;
}) {
  const selected = new Set(value);

  return (
    <Stack gap={1}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle2">Equipment</Typography>
        <Typography variant="caption" color="text.secondary">
          Select multiple
        </Typography>
      </Stack>
      <Box role="group" aria-label="Equipment filter" sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {options.map(([equipment, label]) => {
          const isSelected = equipment ? selected.has(equipment) : value.length === 0;
          return (
            <Tooltip key={equipment} title={label}>
              <ButtonBase aria-label={label} aria-pressed={isSelected}
                onClick={() =>
                  onChange(
                    equipment
                      ? selected.has(equipment)
                        ? value.filter((item) => item !== equipment)
                        : [...value, equipment]
                      : [],
                  )
                }
                sx={{
                  width: { xs: 72, sm: 88 }, aspectRatio: "1", overflow: "hidden", borderRadius: 2,
                  border: "2px solid", borderColor: isSelected ? "primary.main" : "divider",
                  bgcolor: "action.hover", position: "relative",
                  "&.Mui-focusVisible": { outline: "3px solid", outlineColor: "primary.main", outlineOffset: 3 },
                }}>
                {equipment ? (
                  <FitWellImage candidates={resolveEquipmentImageCandidates(equipment)} alt="" />
                ) : <Dashboard aria-hidden="true" sx={{ fontSize: 36, color: "text.secondary" }} />}
                {isSelected && (
                  <Box sx={{ position: "absolute", right: 2, top: 2, display: "flex", borderRadius: "50%", bgcolor: "primary.main", color: "primary.contrastText" }}>
                    <Check aria-hidden="true" sx={{ fontSize: 18 }} />
                  </Box>
                )}
              </ButtonBase>
            </Tooltip>
          );
        })}
      </Box>
    </Stack>
  );
}
