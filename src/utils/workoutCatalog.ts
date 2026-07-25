import abs from "./exercises/abs.json";
import back from "./exercises/back.json";
import biceps from "./exercises/biceps.json";
import calves from "./exercises/calves.json";
import chest from "./exercises/chest.json";
import forearms from "./exercises/forearms.json";
import fullBody from "./exercises/full-body.json";
import glutes from "./exercises/glutes.json";
import hamstrings from "./exercises/hamstrings.json";
import quadriceps from "./exercises/quadriceps.json";
import shoulders from "./exercises/shoulders.json";
import traps from "./exercises/traps.json";
import triceps from "./exercises/triceps.json";

export interface ExerciseCatalogItem {
  name: string;
  equipment:
    | "BARBELL"
    | "DUMBBELL"
    | "KETTLEBELL"
    | "MACHINE"
    | "BODYWEIGHT"
    | "CABLE";
  movement:
    | "PUSH"
    | "PULL"
    | "SQUAT"
    | "HINGE"
    | "LUNGE"
    | "ROTATION"
    | "CARRY"
    | "ISOMETRIC";
  category: string;
  region?: string;
  isCompound: boolean;
}

export const exerciseCatalog = [
  ...chest,
  ...back,
  ...shoulders,
  ...biceps,
  ...triceps,
  ...quadriceps,
  ...hamstrings,
  ...glutes,
  ...calves,
  ...abs,
  ...traps,
  ...forearms,
  ...fullBody,
] as ExerciseCatalogItem[];

export const exerciseCategories = [
  "Chest",
  "Back",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Quadriceps",
  "Hamstrings",
  "Glutes",
  "Calves",
  "Abs",
  "Traps",
  "Forearms",
  "Full Body",
] as const;

export type ExerciseCategory = (typeof exerciseCategories)[number];
