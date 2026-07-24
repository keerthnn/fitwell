import { Add } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import FitWellImage from "fitness/components/common/FitWellImage";
import { resolveExerciseImageCandidates } from "fitness/lib/images/assetRegistry";
import type { Exercise } from "fitness/utils/types";

export default function ExerciseCard({
  exercise,
  onAdd,
}: {
  exercise: Exercise;
  onAdd?: (exercise: Exercise) => void;
}) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        overflow: "hidden",
        transition: "transform .2s ease, border-color .2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          borderColor: "primary.main",
        },
      }}
    >
      <FitWellImage
        candidates={resolveExerciseImageCandidates(exercise)}
        alt={`${exercise.name} exercise illustration`}
        aspectRatio="16 / 10"
      />
      <CardContent>
        <Typography variant="h6">{exercise.name}</Typography>
        <Typography color="text.secondary" variant="body2" mt={0.5}>
          {exercise.primaryMuscle}
        </Typography>
        <Stack direction="row" gap={1} mt={2} flexWrap="wrap">
          <Chip size="small" label={exercise.equipment.toLowerCase()} />
          <Chip size="small" label={exercise.movement.toLowerCase()} />
          <Chip
            size="small"
            color={exercise.isCompound ? "primary" : "default"}
            label={exercise.isCompound ? "Compound" : "Isolation"}
          />
        </Stack>
        {onAdd && (
          <Button
            startIcon={<Add />}
            onClick={() => onAdd(exercise)}
            sx={{ mt: 2 }}
          >
            Add to workout
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
