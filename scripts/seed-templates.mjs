import { randomBytes, randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { loadEnvFile } from "node:process";
import pg from "pg";

try {
  loadEnvFile();
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const catalogFile = new URL(
  "../src/utils/workoutTemplateCatalog.json",
  import.meta.url,
);
const templates = JSON.parse(await readFile(catalogFile, "utf8"));
const requiredTemplateFields = [
  "slug",
  "title",
  "description",
  "goal",
  "difficulty",
  "estimatedDurationM",
  "tags",
  "exercises",
];
const slugs = new Set();

for (const template of templates) {
  for (const field of requiredTemplateFields) {
    if (template[field] === undefined) {
      throw new Error(`${template.title ?? "Template"} is missing ${field}`);
    }
  }
  if (slugs.has(template.slug)) {
    throw new Error(`Duplicate template slug: ${template.slug}`);
  }
  slugs.add(template.slug);
  if (template.exercises.length === 0) {
    throw new Error(`${template.title} must contain at least one exercise`);
  }
}

if (process.argv.includes("--check")) {
  console.log(`Validated ${templates.length} workout templates.`);
  process.exit(0);
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to seed templates");
}

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const client = await pool.connect();

try {
  await client.query("BEGIN");

  const ownerResult = process.env.FITWELL_TEMPLATE_OWNER_EMAIL
    ? await client.query(
        `SELECT "id", "email" FROM "User" WHERE "email" = $1 LIMIT 1`,
        [process.env.FITWELL_TEMPLATE_OWNER_EMAIL],
      )
    : await client.query(`
        SELECT u."id", u."email"
        FROM "AdminAccess" a
        JOIN "User" u ON u."id" = a."userId"
        ORDER BY a."createdAt" ASC
        LIMIT 1
      `);
  const owner = ownerResult.rows[0];
  if (!owner) {
    throw new Error(
      process.env.FITWELL_TEMPLATE_OWNER_EMAIL
        ? `No user found for FITWELL_TEMPLATE_OWNER_EMAIL=${process.env.FITWELL_TEMPLATE_OWNER_EMAIL}`
        : "No admin account exists to own the catalog templates",
    );
  }

  const exerciseIds = new Map();
  const missingExercises = new Set();
  for (const template of templates) {
    for (const exercise of template.exercises) {
      const key = `${exercise.name}:${exercise.equipment}`;
      if (exerciseIds.has(key) || missingExercises.has(key)) continue;
      const result = await client.query(
        `
          SELECT "id"
          FROM "Exercise"
          WHERE "name" = $1 AND "equipment" = $2::"EquipmentType"
          LIMIT 1
        `,
        [exercise.name, exercise.equipment],
      );
      if (result.rows[0]) exerciseIds.set(key, result.rows[0].id);
      else missingExercises.add(key);
    }
  }
  if (missingExercises.size > 0) {
    throw new Error(
      `Missing required exercises. Run pnpm run db:seed-exercises first:\n- ${[...missingExercises].join("\n- ")}`,
    );
  }

  for (const template of templates) {
    const catalogTag = `fitwell-catalog:${template.slug}`;
    const tags = [...new Set([...template.tags, catalogTag])];
    const existingResult = await client.query(
      `
        SELECT "id", "shareToken"
        FROM "WorkoutTemplate"
        WHERE $1 = ANY("tags")
        LIMIT 1
      `,
      [catalogTag],
    );
    const existing = existingResult.rows[0];
    const templateId = existing?.id ?? randomUUID();

    if (existing) {
      await client.query(
        `
          UPDATE "WorkoutTemplate" SET
            "title" = $2,
            "description" = $3,
            "goal" = $4,
            "difficulty" = $5::"TemplateDifficulty",
            "estimatedDurationM" = $6,
            "visibility" = 'PUBLIC'::"TemplateVisibility",
            "tags" = $7,
            "shareToken" = COALESCE("shareToken", $8),
            "isArchived" = FALSE,
            "updatedAt" = NOW()
          WHERE "id" = $1
        `,
        [
          templateId,
          template.title,
          template.description,
          template.goal,
          template.difficulty,
          template.estimatedDurationM,
          tags,
          randomBytes(24).toString("base64url"),
        ],
      );
      await client.query(
        `DELETE FROM "TemplateExercise" WHERE "templateId" = $1`,
        [templateId],
      );
    } else {
      await client.query(
        `
          INSERT INTO "WorkoutTemplate"
            ("id", "ownerId", "title", "description", "goal", "difficulty", "estimatedDurationM", "visibility", "tags", "shareToken", "createdAt", "updatedAt")
          VALUES
            ($1, $2, $3, $4, $5, $6::"TemplateDifficulty", $7, 'PUBLIC'::"TemplateVisibility", $8, $9, NOW(), NOW())
        `,
        [
          templateId,
          owner.id,
          template.title,
          template.description,
          template.goal,
          template.difficulty,
          template.estimatedDurationM,
          tags,
          randomBytes(24).toString("base64url"),
        ],
      );
    }

    for (const [index, exercise] of template.exercises.entries()) {
      await client.query(
        `
          INSERT INTO "TemplateExercise"
            ("id", "templateId", "exerciseId", "order", "targetSets", "minReps", "maxReps", "targetRpe", "restSeconds", "notes")
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `,
        [
          randomUUID(),
          templateId,
          exerciseIds.get(`${exercise.name}:${exercise.equipment}`),
          index + 1,
          exercise.targetSets,
          exercise.minReps,
          exercise.maxReps,
          exercise.targetRpe,
          exercise.restSeconds,
          exercise.notes ?? null,
        ],
      );
    }
  }

  await client.query("COMMIT");
  console.log(`Seeded ${templates.length} workout templates for ${owner.email}.`);
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  client.release();
  await pool.end();
}
