import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { loadEnvFile } from "node:process";
import pg from "pg";
import ts from "typescript";

try {
  loadEnvFile();
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const { Pool } = pg;
const catalogFile = new URL("../src/utils/workoutCatalog.ts", import.meta.url);
const catalogSource = await readFile(catalogFile, "utf8");
const sourceFile = ts.createSourceFile(
  catalogFile.pathname,
  catalogSource,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TS,
);

function literalValue(node) {
  if (ts.isStringLiteral(node)) return node.text;
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  throw new Error(`Unsupported catalog value: ${node.getText(sourceFile)}`);
}

function readExercise(node) {
  if (!ts.isObjectLiteralExpression(node)) {
    throw new Error(`Catalog item is not an object: ${node.getText(sourceFile)}`);
  }

  return Object.fromEntries(
    node.properties.map((property) => {
      if (!ts.isPropertyAssignment(property)) {
        throw new Error(`Unsupported catalog property: ${property.getText(sourceFile)}`);
      }

      const key = property.name.getText(sourceFile).replaceAll('"', "");
      return [key, literalValue(property.initializer)];
    }),
  );
}

let catalogDeclaration;
for (const statement of sourceFile.statements) {
  if (!ts.isVariableStatement(statement)) continue;
  catalogDeclaration = statement.declarationList.declarations.find(
    (declaration) => declaration.name.getText(sourceFile) === "exerciseCatalog",
  );
  if (catalogDeclaration) break;
}

if (!catalogDeclaration || !ts.isArrayLiteralExpression(catalogDeclaration.initializer)) {
  throw new Error("Could not read exerciseCatalog from src/utils/workoutCatalog.ts");
}

const exercises = catalogDeclaration.initializer.elements.map(readExercise);
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
    await client.query(
      `
        INSERT INTO "Exercise"
          ("id", "name", "equipment", "movement", "category", "region", "isCompound", "createdAt", "updatedAt")
        VALUES
          ($1, $2, $3::"EquipmentType", $4::"MovementType", $5, $6, $7, NOW(), NOW())
        ON CONFLICT ("name", "equipment") DO UPDATE SET
          "movement" = EXCLUDED."movement",
          "category" = EXCLUDED."category",
          "region" = EXCLUDED."region",
          "isCompound" = EXCLUDED."isCompound",
          "isArchived" = FALSE,
          "updatedAt" = NOW()
      `,
      [
        randomUUID(),
        exercise.name,
        exercise.equipment,
        exercise.movement,
        exercise.category,
        exercise.region ?? null,
        exercise.isCompound,
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
