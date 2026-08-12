import { Add } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
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
      elevation={1}
      sx={{
        height: "100%",
        overflow: "hidden",
        transition: "transform .2s ease, box-shadow .2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "0 16px 38px rgb(0 0 0 / 0.34)"
              : "0 16px 38px rgb(15 23 42 / 0.14)",
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
        <Typography
          color="text.secondary"
          variant="caption"
          display="block"
          mt={1.5}
          textTransform="capitalize"
        >
          {exercise.equipment.toLowerCase()} · {exercise.movement.toLowerCase()} ·{" "}
          {exercise.isCompound ? "Compound" : "Isolation"}
        </Typography>
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
