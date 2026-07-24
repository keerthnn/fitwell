import { loadEnvFile } from "node:process";

try {
  loadEnvFile();
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

if (process.env.NODE_ENV === "production")
  throw new Error("Refusing to use a production environment");
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
const url = new URL(process.env.DATABASE_URL);
const allowedHosts = new Set([
  "localhost",
  "127.0.0.1",
  "[::1]",
  "::1",
  "postgres",
  "db",
]);
const expectedDatabase = "fitness";
const productionMarkers =
  /prod|production|neon|supabase|render|railway|rds|cloud/i;
if (!allowedHosts.has(url.hostname) || productionMarkers.test(url.hostname)) {
  throw new Error(`Refusing non-local database host: ${url.hostname}`);
}
if (
  url.pathname.slice(1) !== expectedDatabase ||
  productionMarkers.test(url.pathname)
) {
  throw new Error(`Expected local database "${expectedDatabase}"`);
}
console.log(
  `Local database check passed: ${url.hostname}:${url.port || "5432"}/${expectedDatabase}`,
);
console.log(
  "This check applies only to PostgreSQL. Firebase Authentication is not modified.",
);
