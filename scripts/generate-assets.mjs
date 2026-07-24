import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { workoutPlans } from "./data/workout-plans.mjs";

const root = new URL("../public/images/", import.meta.url);
const force = process.argv.includes("--force");
const assets = [];
const slug = (value) =>
  value
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

async function register(relative, kind, provenance) {
  const target = new URL(relative, root);
  let data;
  try {
    data = await readFile(target);
  } catch {
    throw new Error(
      `Missing approved asset: /images/${relative}\nGenerate and visually approve it before rebuilding the manifest.`,
    );
  }
  assets.push({
    path: `/images/${relative}`,
    sha256: createHash("sha256").update(data).digest("hex"),
    provenance,
    kind,
    approved: true,
  });
}

async function copyApproved(source, relative) {
  const target = new URL(relative, root);
  await mkdir(new URL("./", target), { recursive: true });
  try {
    if (!force) await readFile(target);
    else await copyFile(source, target);
  } catch {
    await copyFile(source, target);
  }
  await register(relative, "muscle-group", "approved-legacy-muscle-png");
}

const legacyMuscles = {
  front: [
    "chest",
    "biceps",
    "shoulders",
    "quads",
    "total-abs",
    "upper-abs",
    "lower-abs",
    "obliques",
  ],
  back: [
    "back",
    "triceps",
    "hamstrings",
    "calves",
    "glutes",
    "upper-back",
    "middle-back",
    "lower-back",
  ],
};
for (const [side, names] of Object.entries(legacyMuscles)) {
  for (const name of names) {
    await copyApproved(
      new URL(`../public/muscle-groups/${name}.png`, import.meta.url),
      `muscle-groups/${side}/${name}.png`,
    );
  }
}
await copyApproved(
  new URL("../public/muscle-groups/full-body.png", import.meta.url),
  "muscle-groups/front/full-body.png",
);
await copyApproved(
  new URL("../public/muscle-groups/full-body.png", import.meta.url),
  "fallbacks/full-body.png",
);

for (const name of new Set(workoutPlans.flatMap((plan) => plan.exercises))) {
  const nameSlug = slug(name);
  for (const size of [256, 512]) {
    await register(
      `exercises/specific/${nameSlug}-${size}.webp`,
      "exercise",
      "openai-imagegen-fitwell-anatomical-reference",
    );
  }
}

for (const name of [
  "barbell",
  "dumbbell",
  "kettlebell",
  "cable",
  "machine",
  "smith-machine",
  "selectorized-machine",
  "bodyweight",
  "resistance-band",
]) {
  for (const size of [256, 512]) {
    await register(
      `equipment/${name}-${size}.webp`,
      "equipment",
      "openai-imagegen-fitwell-anatomical-reference",
    );
  }
}

for (const [side, name] of [
  ["front", "forearms"],
  ["back", "traps"],
]) {
  for (const size of [256, 512]) {
    await register(
      `muscle-groups/${side}/${name}-${size}.webp`,
      "muscle-group",
      "openai-imagegen-matched-to-approved-muscle-png",
    );
  }
}

for (const name of [
  "strength",
  "push",
  "pull",
  "legs",
  "full",
  "conditioning",
  "core",
]) {
  for (const size of [384, 768]) {
    await register(
      `workouts/${name}-${size}.webp`,
      "workout-cover",
      "openai-imagegen-fitwell-cover",
    );
  }
}

for (const plan of workoutPlans) {
  for (const size of [384, 768]) {
    await register(
      `workout-plans/covers/${plan.slug}-${size}.webp`,
      "plan-cover",
      "openai-imagegen-fitwell-cover",
    );
  }
}

await writeFile(
  new URL("asset-manifest.json", root),
  `${JSON.stringify(
    { version: 2, generatedAt: new Date().toISOString(), assets },
    null,
    2,
  )}\n`,
);
console.log(
  `Prepared ${assets.length} approved high-quality FitWell assets without regenerating existing imagery.`,
);
