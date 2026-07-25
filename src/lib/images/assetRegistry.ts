import type {
  Exercise,
  WorkoutListItem,
  WorkoutPlan,
} from "fitness/utils/types";

export type ImageCandidateKind =
  | "specific"
  | "equipment"
  | "muscle"
  | "generated"
  | "fallback";

export interface ImageCandidate {
  src: string;
  kind: ImageCandidateKind;
  srcSet?: string;
}

const priorityExercises = new Set([
  "Arnold Press",
  "Barbell Back Squat",
  "Barbell Bench Press",
  "Barbell Curl",
  "Barbell Hip Thrust",
  "Barbell Overhead Press",
  "Barbell Row",
  "Barbell Skull Crusher",
  "Bench Dip",
  "Bicycle Crunch",
  "Cable Crunch",
  "Cable Fly",
  "Close-Grip Bench Press",
  "Concentration Curl",
  "Dumbbell Bicep Curl",
  "Dumbbell Bulgarian Split Squat",
  "Dumbbell Lateral Raise",
  "Dumbbell Preacher Curl",
  "Dumbbell Rear Delt Fly",
  "Face Pull",
  "Hammer Curl",
  "Hanging Leg Raise",
  "Incline Dumbbell Press",
  "Lat Pulldown",
  "Leg Press",
  "Lying Leg Curl",
  "Mountain Climber",
  "Overhead Dumbbell Extension",
  "Pec Deck Fly",
  "Plank",
  "Pull-Up",
  "Push-Up",
  "Romanian Deadlift",
  "Russian Twist",
  "Seated Cable Row",
  "Standing Machine Calf Raise",
  "Straight-Arm Cable Pulldown",
  "Suitcase Carry",
  "Tricep Pushdown",
  "Walking Lunge",
]);

const planSlugs: Record<string, string> = {
  "Push Day": "push-day",
  "Pull Day": "pull-day",
  "Leg Day": "leg-day",
  "Upper Body": "upper-body",
  "Lower Body": "lower-body",
  Chest: "chest",
  Back: "back",
  Shoulders: "shoulders",
  Biceps: "biceps",
  Triceps: "triceps",
  Arms: "arms",
  Abs: "abs",
  "Full Body": "full-body",
};

const equipmentSlugs: Record<string, string> = {
  BARBELL: "barbell",
  DUMBBELL: "dumbbell",
  KETTLEBELL: "kettlebell",
  CABLE: "cable",
  "CABLE MACHINE": "cable",
  MACHINE: "machine",
  "SMITH MACHINE": "smith-machine",
  "SELECTORIZED MACHINE": "selectorized-machine",
  BODYWEIGHT: "bodyweight",
  "RESISTANCE BAND": "resistance-band",
};

const musclePaths: Record<string, string> = {
  chest: "/images/muscle-groups/front/chest.png",
  biceps: "/images/muscle-groups/front/biceps.png",
  shoulders: "/images/muscle-groups/front/shoulders.png",
  quadriceps: "/images/muscle-groups/front/quads.png",
  quads: "/images/muscle-groups/front/quads.png",
  abs: "/images/muscle-groups/front/total-abs.png",
  "total abs": "/images/muscle-groups/front/total-abs.png",
  "upper abs": "/images/muscle-groups/front/upper-abs.png",
  "lower abs": "/images/muscle-groups/front/lower-abs.png",
  obliques: "/images/muscle-groups/front/obliques.png",
  forearms: "/images/muscle-groups/front/forearms-512.webp",
  back: "/images/muscle-groups/back/back.png",
  "total back": "/images/muscle-groups/back/back.png",
  "upper back": "/images/muscle-groups/back/upper-back.png",
  "middle back": "/images/muscle-groups/back/middle-back.png",
  "lower back": "/images/muscle-groups/back/lower-back.png",
  lats: "/images/muscle-groups/back/back.png",
  triceps: "/images/muscle-groups/back/triceps.png",
  hamstrings: "/images/muscle-groups/back/hamstrings.png",
  calves: "/images/muscle-groups/back/calves.png",
  glutes: "/images/muscle-groups/back/glutes.png",
  traps: "/images/muscle-groups/back/traps-512.webp",
  "upper traps": "/images/muscle-groups/back/traps-512.webp",
  "full body": "/images/muscle-groups/front/full-body.png",
};

const muscleAliases: Array<[RegExp, keyof typeof musclePaths]> = [
  [/\b(glute|gluteus)\w*\b/, "glutes"],
  [/\bquadricep\w*\b/, "quadriceps"],
  [/\bhamstring\w*\b/, "hamstrings"],
  [/\b(gastrocnemius|soleus|calf|calves)\b/, "calves"],
  [/\b(forearm|grip)\w*\b/, "forearms"],
  [/\b(delt|deltoid|shoulder)\w*\b/, "shoulders"],
  [/\b(lat|latissimus)\w*\b/, "back"],
  [/\btrap|trapezius\b/, "traps"],
  [/\b(core|abdominal)\w*\b/, "total abs"],
  [/\bbrachialis\b/, "biceps"],
];

const slug = (value: string) =>
  value
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export function isApprovedLocalImagePath(value?: string | null) {
  return Boolean(
    value &&
    value.startsWith("/images/") &&
    !value.includes("..") &&
    !value.startsWith("/images/exercises/featured/") &&
    !value.startsWith("/images/muscles/") &&
    !(value.startsWith("/images/equipment/") && value.endsWith(".svg")) &&
    !(value.startsWith("/images/exercises/") && value.endsWith(".svg")) &&
    !(value.startsWith("/images/workout-plans/") && value.endsWith(".svg")) &&
    !(value.startsWith("/images/workouts/") && value.endsWith(".svg")) &&
    !(value.startsWith("/images/fallbacks/") && value.endsWith(".svg")) &&
    !(value.startsWith("/images/muscle-groups/") && value.endsWith(".svg")),
  );
}

const candidate = (
  src: string | null | undefined,
  kind: ImageCandidateKind,
  srcSet?: string,
): ImageCandidate | null =>
  src && isApprovedLocalImagePath(src) ? { src, kind, srcSet } : null;

const responsive = (
  directory: string,
  name: string,
  kind: ImageCandidateKind,
  large = 512,
  small = 256,
) =>
  candidate(
    `${directory}/${name}-${large}.webp`,
    kind,
    `${directory}/${name}-${small}.webp ${small}w, ${directory}/${name}-${large}.webp ${large}w`,
  );

const unique = (items: Array<ImageCandidate | null | undefined>) => {
  const seen = new Set<string>();
  return items.filter((item): item is ImageCandidate => {
    if (!item || seen.has(item.src)) return false;
    seen.add(item.src);
    return true;
  });
};

export function resolveEquipmentImageCandidates(equipment: string) {
  const equipmentSlug = equipmentSlugs[equipment.toUpperCase()] ?? "equipment";
  return unique([
    responsive("/images/equipment", equipmentSlug, "equipment"),
    responsive("/images/equipment", "machine", "fallback"),
  ]);
}

export function resolveMuscleImageCandidates(muscle: string) {
  const normalized = muscle.toLowerCase();
  const exact = musclePaths[normalized];
  const alias = muscleAliases.find(([pattern]) =>
    pattern.test(normalized),
  )?.[1];
  const partial = Object.entries(musclePaths).find(([key]) =>
    normalized.includes(key),
  )?.[1];
  return unique([
    candidate(exact ?? (alias ? musclePaths[alias] : partial), "muscle"),
    candidate("/images/muscle-groups/front/full-body.png", "fallback"),
  ]);
}

export function resolveExerciseImageCandidates(
  exercise: Pick<
    Exercise,
    | "name"
    | "imagePath"
    | "equipmentImagePath"
    | "equipment"
    | "primaryMuscle"
    | "category"
    | "movement"
  >,
) {
  const specific = priorityExercises.has(exercise.name)
    ? responsive("/images/exercises/specific", slug(exercise.name), "specific")
    : null;
  const equipment = resolveEquipmentImageCandidates(exercise.equipment)[0];
  const muscle =
    resolveMuscleImageCandidates(exercise.primaryMuscle).find(
      (item) => item.kind === "muscle",
    ) ??
    resolveMuscleImageCandidates(exercise.category).find(
      (item) => item.kind === "muscle",
    );
  return unique([
    candidate(exercise.imagePath, "specific"),
    specific,
    muscle,
    candidate(exercise.equipmentImagePath, "equipment"),
    equipment,
    candidate("/images/muscle-groups/front/full-body.png", "generated"),
    candidate("/images/fallbacks/full-body.png", "fallback"),
  ]);
}

function workoutCoverKind(value: string) {
  const normalized = value.toLowerCase();
  if (/(push|chest|triceps)/.test(normalized)) return "push";
  if (/(pull|back|biceps)/.test(normalized)) return "pull";
  if (/(leg|lower)/.test(normalized)) return "legs";
  if (/(abs|core)/.test(normalized)) return "core";
  if (/(full|upper|shoulders)/.test(normalized)) return "full";
  if (/(cardio|conditioning)/.test(normalized)) return "conditioning";
  return "strength";
}

export function resolveWorkoutImageCandidates(workout: WorkoutListItem) {
  const exercise = workout.representativeExercise;
  return unique([
    candidate(workout.sourcePlanCoverImagePath, "specific"),
    ...(exercise ? resolveExerciseImageCandidates(exercise) : []),
    responsive(
      "/images/workouts",
      workoutCoverKind(workout.sourcePlanCategory ?? workout.name),
      "generated",
      768,
      384,
    ),
    responsive("/images/workouts", "strength", "fallback", 768, 384),
  ]);
}

export function resolveWorkoutPlanImageCandidates(
  plan: Pick<WorkoutPlan, "name" | "category" | "coverImagePath" | "exercises">,
) {
  const firstExercise = plan.exercises[0]?.exercise;
  return unique([
    candidate(plan.coverImagePath, "specific"),
    planSlugs[plan.name]
      ? responsive(
          "/images/workout-plans/covers",
          planSlugs[plan.name],
          "specific",
          768,
          384,
        )
      : null,
    ...(firstExercise ? resolveExerciseImageCandidates(firstExercise) : []),
    responsive(
      "/images/workouts",
      workoutCoverKind(plan.category || plan.name),
      "generated",
      768,
      384,
    ),
    responsive("/images/workouts", "strength", "fallback", 768, 384),
  ]);
}

export { priorityExercises };
