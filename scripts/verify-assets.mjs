import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { readFile, readdir } from "node:fs/promises";
import { workoutPlans } from "./data/workout-plans.mjs";

const publicRoot = new URL("../public/", import.meta.url);
const imagesRoot = new URL("../public/images/", import.meta.url);
const manifest = JSON.parse(await readFile(new URL("asset-manifest.json", imagesRoot), "utf8"));
const failures = [];
const slug = (value) =>
  value
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

async function exactFile(relative) {
  const parts = relative.split("/");
  let directory = publicRoot;
  for (const [index, part] of parts.entries()) {
    const entries = await readdir(directory);
    if (!entries.includes(part)) {
      failures.push(`Filename case/path mismatch: /${relative}`);
      return null;
    }
    directory = new URL(`${part}${index === parts.length - 1 ? "" : "/"}`, directory);
  }
  return directory;
}

function verifySvg(path, data, kind) {
  const source = data.toString("utf8");
  if (source.includes("<text")) failures.push(`Embedded text is not allowed: ${path}`);
  if (/https?:\/\//i.test(source.replace("http://www.w3.org/2000/svg", "")))
    failures.push(`External reference in ${path}`);
  const viewBox = source.match(/viewBox="0 0 (\d+) (\d+)"/);
  if (!viewBox) failures.push(`Missing SVG viewBox: ${path}`);
  else {
    const [, width, height] = viewBox;
    const coverKind = kind === "workout-cover" || kind === "plan-cover";
    if (coverKind && (width !== "768" || height !== "512"))
      failures.push(`Cover must be 3:2 (768x512): ${path}`);
    if (!coverKind && (width !== "512" || height !== "512"))
      failures.push(`Icon must be square (512x512 viewBox): ${path}`);
  }
}

function verifyPng(path, data) {
  if (data.toString("hex", 1, 4) !== "504e47") {
    failures.push(`Invalid PNG: ${path}`);
    return;
  }
  const width = data.readUInt32BE(16);
  const height = data.readUInt32BE(20);
  const colorType = data[25];
  if (width !== height) failures.push(`Muscle image must be square: ${path}`);
  if (![4, 6].includes(colorType))
    failures.push(`Muscle image must include alpha: ${path}`);
}

function verifyWebp(path, target, kind) {
  let details;
  try {
    details = execFileSync("webpinfo", [fileURLToPath(target)], {
      encoding: "utf8",
    });
  } catch {
    failures.push(`Unable to inspect WebP: ${path}`);
    return;
  }
  const canvas =
    details.match(/Canvas size (\d+) x (\d+)/) ??
    details.match(/Width:\s*(\d+)[\s\S]*?Height:\s*(\d+)/);
  if (!canvas) {
    failures.push(`Missing WebP canvas metadata: ${path}`);
    return;
  }
  const width = Number(canvas[1]);
  const height = Number(canvas[2]);
  const coverKind = kind === "workout-cover" || kind === "plan-cover";
  if (coverKind && width / height !== 1.5)
    failures.push(`Cover WebP must be 3:2: ${path}`);
  if (!coverKind && width !== height)
    failures.push(`Icon WebP must be square: ${path}`);
  if (!coverKind && !/Chunk VP8X[\s\S]*?Alpha: 1/.test(details))
    failures.push(`Icon WebP must include alpha: ${path}`);
  const namedSize = Number(path.match(/-(\d+)\.webp$/)?.[1]);
  if (namedSize && width !== namedSize)
    failures.push(`WebP width does not match filename: ${path}`);
}

const approved = new Set();
for (const asset of manifest.assets) {
  if (!asset.approved) failures.push(`Unapproved manifest entry: ${asset.path}`);
  if (!asset.path.startsWith("/images/") || /^https?:/i.test(asset.path))
    failures.push(`Asset must use a local /images path: ${asset.path}`);
  if (approved.has(asset.path)) failures.push(`Duplicate manifest path: ${asset.path}`);
  approved.add(asset.path);
  const relative = asset.path.slice(1);
  const target = await exactFile(relative);
  if (!target) continue;
  const data = await readFile(target);
  const hash = createHash("sha256").update(data).digest("hex");
  if (hash !== asset.sha256) failures.push(`Checksum mismatch: ${asset.path}`);
  if (asset.path.endsWith(".svg")) verifySvg(asset.path, data, asset.kind);
  if (asset.path.endsWith(".png")) verifyPng(asset.path, data);
  if (asset.path.endsWith(".webp")) verifyWebp(asset.path, target, asset.kind);
}

const requiredEquipment = [
  "barbell",
  "dumbbell",
  "kettlebell",
  "cable",
  "machine",
  "smith-machine",
  "selectorized-machine",
  "bodyweight",
  "resistance-band",
];
for (const name of requiredEquipment) {
  for (const size of [256, 512]) {
    const path = `/images/equipment/${name}-${size}.webp`;
    if (!approved.has(path)) failures.push(`Missing equipment fallback: ${path}`);
  }
}

for (const path of [
  "/images/fallbacks/full-body.png",
  "/images/equipment/machine-512.webp",
  "/images/workouts/strength-768.webp",
]) {
  if (!approved.has(path)) {
    failures.push(`Missing neutral fallback: ${path}`);
  }
}

const priorityExercises = new Set(
  workoutPlans.flatMap((plan) => plan.exercises),
);
if (priorityExercises.size !== 40)
  failures.push(`Expected 40 priority exercises, found ${priorityExercises.size}`);
for (const name of priorityExercises) {
  for (const size of [256, 512]) {
    const path = `/images/exercises/specific/${slug(name)}-${size}.webp`;
    if (!approved.has(path)) failures.push(`Missing specific exercise icon: ${name}`);
  }
}

for (const plan of workoutPlans) {
  for (const size of [384, 768]) {
    const path = `/images/workout-plans/covers/${plan.slug}-${size}.webp`;
    if (!approved.has(path)) failures.push(`Missing Workout Plan cover: ${plan.name}`);
  }
}

for (const name of [
  "Lat Pulldown",
  "Leg Press",
  "Lying Leg Curl",
  "Standing Machine Calf Raise",
  "Pec Deck Fly",
]) {
  const path = `/images/exercises/specific/${slug(name)}-512.webp`;
  if (!approved.has(path)) failures.push(`Missing machine-specific icon: ${name}`);
}

const catalogueDirectory = new URL("../src/utils/exercises/", import.meta.url);
const catalogueFiles = (await readdir(catalogueDirectory)).filter((file) =>
  file.endsWith(".json"),
);
const catalogue = (
  await Promise.all(
    catalogueFiles.map(async (file) =>
      JSON.parse(await readFile(new URL(file, catalogueDirectory), "utf8")),
    ),
  )
).flat();
if (catalogue.length !== 246)
  failures.push(`Expected 246 catalogue exercises, found ${catalogue.length}`);
for (const exercise of catalogue) {
  const equipment = `/images/equipment/${exercise.equipment.toLowerCase()}-512.webp`;
  const resolved =
    (priorityExercises.has(exercise.name) &&
      approved.has(`/images/exercises/specific/${slug(exercise.name)}-512.webp`)) ||
    approved.has(equipment) ||
    approved.has("/images/fallbacks/full-body.png");
  if (!resolved) failures.push(`Exercise cannot resolve an image: ${exercise.name}`);
}

if (failures.length)
  throw new Error(`Asset verification failed:\n${failures.join("\n")}`);
console.log(
  `Verified ${manifest.assets.length} approved assets and image resolution for ${catalogue.length} exercises.`,
);
