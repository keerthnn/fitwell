import FitWellImage from "fitness/components/common/FitWellImage";
import { resolveWorkoutImageCandidates } from "fitness/lib/images/assetRegistry";
import type { WorkoutListItem } from "fitness/utils/types";

export default function WorkoutSummaryVisual({
  workout,
  height,
  aspectRatio = "16 / 10",
}: {
  workout: WorkoutListItem;
  height?: number | string;
  aspectRatio?: string;
  compact?: boolean;
}) {
  return (
    <FitWellImage
      candidates={resolveWorkoutImageCandidates(workout)}
      alt={`${workout.name} workout illustration`}
      height={height}
      aspectRatio={aspectRatio}
      objectFit="contain"
    />
  );
}
