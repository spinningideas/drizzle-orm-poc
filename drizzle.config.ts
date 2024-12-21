import { Config, defineConfig } from "drizzle-kit";
import { env } from "./src/utils";

const dbServer = env("DB_SERVER");
const dbPort = env("DB_PORT");
const dbUser = env("DB_USER");
const dbPassword = env("DB_PASSWORD");
const dbName = env("DB_NAME");
const dbUrl = `postgresql://${dbUser}:${dbPassword}@${dbServer}:${dbPort}/${dbName}`;

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dbCredentials: {
    url: dbUrl,
  },
  migrations: {
    prefix: "none",
    table: "__migrations__",
    schema: "public",
  },
} as Config);
