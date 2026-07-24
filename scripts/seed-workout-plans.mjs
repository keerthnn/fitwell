import { randomUUID } from "node:crypto";
import { loadEnvFile } from "node:process";
import pg from "pg";
import { workoutPlans } from "./data/workout-plans.mjs";

try {
  loadEnvFile();
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const placements = workoutPlans.reduce((sum, item) => sum + item.exercises.length, 0);
const uniqueExercises = new Set(workoutPlans.flatMap((item) => item.exercises));
if (workoutPlans.length !== 13 || placements !== 76 || uniqueExercises.size !== 40) {
  throw new Error("Workout Plan catalogue must contain 13 plans, 76 placements, and 40 unique exercises");
}
if (process.argv.includes("--check")) {
  console.log("Validated 13 Workout Plans, 76 placements, and 40 unique exercises.");
  process.exit(0);
}
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const client = await pool.connect();
try {
  await client.query("BEGIN");
  const rows = await client.query(`SELECT "id", "name" FROM "Exercise" WHERE "name" = ANY($1::text[])`, [[...uniqueExercises]]);
  const exerciseIds = new Map(rows.rows.map((row) => [row.name, row.id]));
  const missing = [...uniqueExercises].filter((name) => !exerciseIds.has(name));
  if (missing.length) throw new Error(`Missing exercises: ${missing.join(", ")}`);

  for (const item of workoutPlans) {
    const existing = await client.query(`SELECT "id" FROM "WorkoutPlan" WHERE "name" = $1 AND "isBuiltIn" = TRUE LIMIT 1`, [item.name]);
    const id = existing.rows[0]?.id ?? randomUUID();
    if (existing.rows[0]) {
      await client.query(`UPDATE "WorkoutPlan" SET "description"=$2, "difficulty"=$3::"WorkoutPlanDifficulty", "category"=$4, "daysPerWeek"=$5, "userId"=NULL, "isBuiltIn"=TRUE, "isFeatured"=TRUE, "isActive"=TRUE, "isArchived"=FALSE, "coverImagePath"=$6, "updatedAt"=NOW() WHERE "id"=$1`, [id, item.description, item.difficulty, item.category, item.daysPerWeek, `/images/workout-plans/${item.slug}.svg`]);
      await client.query(`DELETE FROM "WorkoutPlanExercise" WHERE "workoutPlanId"=$1`, [id]);
    } else {
      await client.query(`INSERT INTO "WorkoutPlan" ("id","userId","name","description","difficulty","category","daysPerWeek","isBuiltIn","isFeatured","isActive","isArchived","coverImagePath","createdAt","updatedAt") VALUES ($1,NULL,$2,$3,$4::"WorkoutPlanDifficulty",$5,$6,TRUE,TRUE,TRUE,FALSE,$7,NOW(),NOW())`, [id, item.name, item.description, item.difficulty, item.category, item.daysPerWeek, `/images/workout-plans/${item.slug}.svg`]);
    }
    for (const [index, name] of item.exercises.entries()) {
      await client.query(`INSERT INTO "WorkoutPlanExercise" ("id","workoutPlanId","exerciseId","order","sets","minimumReps","maximumReps","restSeconds","createdAt","updatedAt") VALUES ($1,$2,$3,$4,3,8,12,90,NOW(),NOW())`, [randomUUID(), id, exerciseIds.get(name), index]);
      await client.query(`UPDATE "Exercise" SET "imagePath"=$2 WHERE "id"=$1`, [exerciseIds.get(name), `/images/exercises/featured/${name.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.svg`]);
    }
  }
  await client.query("COMMIT");
  console.log("Seeded 13 built-in Workout Plans.");
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  client.release();
  await pool.end();
}
