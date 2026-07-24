import { randomUUID } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { loadEnvFile } from "node:process";
import pg from "pg";

try {
  loadEnvFile();
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const { Pool } = pg;
const catalogDirectory = new URL("../src/utils/exercises/", import.meta.url);
const catalogFiles = (await readdir(catalogDirectory)).filter((file) => file.endsWith(".json")).sort();
const exercises = (
  await Promise.all(
    catalogFiles.map(async (file) =>
      JSON.parse(await readFile(new URL(file, catalogDirectory), "utf8")),
    ),
  )
).flat();
const equipmentTypes = new Set([
  "BARBELL",
  "DUMBBELL",
  "KETTLEBELL",
  "MACHINE",
  "BODYWEIGHT",
  "CABLE",
]);
const movementTypes = new Set([
  "PUSH",
  "PULL",
  "SQUAT",
  "HINGE",
  "LUNGE",
  "ROTATION",
  "CARRY",
  "ISOMETRIC",
]);

for (const exercise of exercises) {
  if (!exercise.name || !exercise.category) {
    throw new Error("Every catalog exercise needs a name and category");
  }
  if (!equipmentTypes.has(exercise.equipment)) {
    throw new Error(`Unknown equipment for ${exercise.name}: ${exercise.equipment}`);
  }
  if (!movementTypes.has(exercise.movement)) {
    throw new Error(`Unknown movement for ${exercise.name}: ${exercise.movement}`);
  }
}

if (process.argv.includes("--check")) {
  console.log(`Validated ${exercises.length} catalog exercises.`);
  process.exit(0);
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to seed exercises");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const client = await pool.connect();

try {
  await client.query("BEGIN");

  for (const exercise of exercises) {
    const trackingType =
      exercise.equipment === "BODYWEIGHT" ? "REPS_ONLY" : "REPS_WEIGHT";
    const equipmentImagePath = `/images/equipment/${exercise.equipment.toLowerCase()}.svg`;
    await client.query(
      `
        INSERT INTO "Exercise"
          ("id", "name", "description", "instructions", "equipment", "movement",
           "category", "primaryMuscle", "isCompound", "trackingType", "isActive",
           "equipmentImagePath", "createdAt", "updatedAt")
        VALUES
          ($1, $2, $3, $4, $5::"EquipmentType", $6::"MovementType", $7, $8,
           $9, $10::"ExerciseTrackingType", TRUE, $11, NOW(), NOW())
        ON CONFLICT ("name", "equipment") DO UPDATE SET
          "movement" = EXCLUDED."movement",
          "category" = EXCLUDED."category",
          "primaryMuscle" = EXCLUDED."primaryMuscle",
          "isCompound" = EXCLUDED."isCompound",
          "trackingType" = EXCLUDED."trackingType",
          "isActive" = TRUE,
          "equipmentImagePath" = EXCLUDED."equipmentImagePath",
          "updatedAt" = NOW()
      `,
      [
        randomUUID(),
        exercise.name,
        `${exercise.name} for ${exercise.region ?? exercise.category}.`,
        "Use controlled form and a range of motion appropriate for you.",
        exercise.equipment,
        exercise.movement,
        exercise.category,
        exercise.region ?? exercise.category,
        exercise.isCompound,
        trackingType,
        equipmentImagePath,
      ],
    );
  }

  await client.query("COMMIT");
  console.log(`Seeded ${exercises.length} exercises.`);
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  client.release();
  await pool.end();
}
