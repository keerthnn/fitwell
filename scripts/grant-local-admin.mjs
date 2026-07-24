import { loadEnvFile } from "node:process";
import pg from "pg";

try {
  loadEnvFile();
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const identifier = process.argv[2]?.trim();
if (!identifier)
  throw new Error("Pass an exact synchronized Firebase UID or email");
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
const url = new URL(process.env.DATABASE_URL);
if (
  !["localhost", "127.0.0.1", "[::1]", "::1", "postgres", "db"].includes(
    url.hostname,
  ) ||
  url.pathname !== "/fitness"
) {
  throw new Error(
    "Local admin bootstrap is restricted to the local fitness database",
  );
}

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
  const result = await client.query(
    `SELECT "id" FROM "User" WHERE ("id"=$1 OR "email"=$1) AND "isDisabled"=FALSE AND "deletedAt" IS NULL LIMIT 1`,
    [identifier],
  );
  const user = result.rows[0];
  if (!user)
    throw new Error(
      "Synchronize an active Firebase user before granting admin access",
    );
  await client.query(
    `INSERT INTO "AdminAccess" ("userId","createdAt") VALUES ($1,NOW()) ON CONFLICT ("userId") DO NOTHING`,
    [user.id],
  );
  console.log(`Granted local admin access to synchronized user ${user.id}.`);
} finally {
  await client.end();
}
