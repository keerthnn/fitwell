import catalog from "fitness/utils/workoutTemplateCatalog.json";

export const WORKOUT_TEMPLATE_CATALOG_TAG_PREFIX = "fitwell-catalog:";

export const workoutTemplateImageSources: Record<string, string> = {
  "push-day": "/muscle-groups/chest.png",
  "pull-day": "/muscle-groups/back.png",
  "leg-day": "/muscle-groups/legs.png",
  "upper-body": "/muscle-groups/full-body.png",
  "lower-body": "/muscle-groups/legs.png",
  chest: "/muscle-groups/chest.png",
  back: "/muscle-groups/back.png",
  shoulders: "/muscle-groups/shoulders.png",
  biceps: "/muscle-groups/biceps.png",
  triceps: "/muscle-groups/triceps.png",
  arms: "/muscle-groups/biceps.png",
  abs: "/muscle-groups/total-abs.png",
  "full-body": "/muscle-groups/full-body.png",
};

export interface WorkoutTemplateCatalogExercise {
  name: string;
  equipment:
    | "BARBELL"
    | "DUMBBELL"
    | "KETTLEBELL"
    | "MACHINE"
    | "BODYWEIGHT"
    | "CABLE";
  targetSets: number;
  minReps: number;
  maxReps: number;
  targetRpe: number;
  restSeconds: number;
  notes?: string;
}

export interface WorkoutTemplateCatalogItem {
  slug: string;
  title: string;
  description: string;
  goal: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  estimatedDurationM: number;
  tags: string[];
  exercises: WorkoutTemplateCatalogExercise[];
}

export const workoutTemplateCatalog = catalog as WorkoutTemplateCatalogItem[];

export function getWorkoutTemplateCatalogTag(slug: string) {
  return `${WORKOUT_TEMPLATE_CATALOG_TAG_PREFIX}${slug}`;
}

export function getWorkoutTemplateCatalogSlug(tags: string[]) {
  return tags
    .find((tag) => tag.startsWith(WORKOUT_TEMPLATE_CATALOG_TAG_PREFIX))
    ?.slice(WORKOUT_TEMPLATE_CATALOG_TAG_PREFIX.length);
}

export function getWorkoutTemplateImageSource(slug?: string | null) {
  return slug
    ? workoutTemplateImageSources[slug] ?? "/muscle-groups/full-body.png"
    : "/muscle-groups/full-body.png";
}
