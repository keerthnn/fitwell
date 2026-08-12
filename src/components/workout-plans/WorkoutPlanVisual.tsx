import FitWellImage from "fitness/components/common/FitWellImage";
import { resolveWorkoutPlanImageCandidates } from "fitness/lib/images/assetRegistry";
import type { WorkoutPlan } from "fitness/utils/types";

export default function WorkoutPlanVisual({
  plan,
  height,
  aspectRatio = "3 / 2",
}: {
  plan: WorkoutPlan;
  height?: number | string;
  aspectRatio?: string;
  compact?: boolean;
}) {
  return (
    <FitWellImage
      candidates={resolveWorkoutPlanImageCandidates(plan)}
      alt={`${plan.name} workout plan cover`}
      height={height}
      aspectRatio={aspectRatio}
      objectFit="contain"
    />
  );
}
