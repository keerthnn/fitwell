import type { WorkoutSet } from "fitness/utils/types";
import { DEFAULT_REST_SECONDS } from "fitness/utils/restTimer";

export const DEFAULT_EXERCISE_REST_SECONDS = DEFAULT_REST_SECONDS;
export const MAX_EXERCISE_REST_SECONDS = 7200;

export function resolveExerciseRestSeconds(
  sets: readonly WorkoutSet[],
): number {
  const firstPrescribedSet = sets
    .map((set, index) => ({ set, index }))
    .sort(
      (left, right) =>
        left.set.setNumber - right.set.setNumber || left.index - right.index,
    )
    .find(({ set }) => set.restSeconds != null);

  return (
    firstPrescribedSet?.set.restSeconds ?? DEFAULT_EXERCISE_REST_SECONDS
  );
}

export function stampExerciseRestSeconds(
  sets: readonly WorkoutSet[],
  restSeconds: number,
): WorkoutSet[] {
  return sets.map((set) => ({ ...set, restSeconds }));
}
