import { access } from "node:fs/promises";
import { workoutPlans } from "./data/workout-plans.mjs";

const root = new URL("../public/images/", import.meta.url);
const slug = (value) => value.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const required = [
  "exercises/fallback.svg",
  "workout-plans/fallback.svg",
  ...["barbell", "dumbbell", "kettlebell", "machine", "bodyweight", "cable"].map((name) => `equipment/${name}.svg`),
  ...["chest", "biceps", "shoulders", "quadriceps", "abs", "forearms"].map((name) => `muscles/front/${name}.svg`),
  ...["back", "triceps", "hamstrings", "calves", "glutes", "traps"].map((name) => `muscles/back/${name}.svg`),
  ...workoutPlans.map((item) => `workout-plans/${item.slug}.svg`),
  ...new Set(workoutPlans.flatMap((item) => item.exercises).map((name) => `exercises/featured/${slug(name)}.svg`)),
];
const missing = [];
for (const relative of required) {
  try {
    await access(new URL(relative, root));
  } catch {
    missing.push(relative);
  }
}
if (missing.length) throw new Error(`Missing required assets:\n${missing.join("\n")}`);
console.log(`Verified ${required.length} required FitWell assets.`);
