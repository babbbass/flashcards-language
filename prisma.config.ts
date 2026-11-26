import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Optional on purpose: `prisma generate` (run on postinstall) needs no database,
    // so a fresh clone or CI without .env must still install. Commands that do need
    // it (migrate, studio) fail with a clear error, and lib/prisma.ts checks it at runtime.
    url: process.env.DATABASE_URL,
  },
});
