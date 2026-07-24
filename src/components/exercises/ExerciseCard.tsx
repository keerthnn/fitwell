import { Card, CardContent, CardMedia, Chip, Stack, Typography } from "@mui/material";
import { resolveExerciseImage } from "fitness/utils/exerciseCatalog";
import type { Exercise } from "fitness/utils/types";

export default function ExerciseCard({ exercise }: { exercise: Exercise }) {
  return (
    <Card variant="outlined">
      <CardMedia component="img" height={180} image={resolveExerciseImage(exercise)} alt="" sx={{ objectFit: "contain", bgcolor: "grey.50" }} />
      <CardContent>
        <Typography variant="h6">{exercise.name}</Typography>
        <Typography color="text.secondary">{exercise.primaryMuscle}</Typography>
        <Stack direction="row" gap={1} mt={2} flexWrap="wrap">
          <Chip size="small" label={exercise.equipment.toLowerCase()} />
          <Chip size="small" label={exercise.trackingType.replaceAll("_", " ").toLowerCase()} />
        </Stack>
      </CardContent>
    </Card>
  );
}
