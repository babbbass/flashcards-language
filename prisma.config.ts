import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Same files as Next.js: .env.local first (secrets, git-ignored), then .env.
config({ path: [".env.local", ".env"], quiet: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Optional on purpose: `prisma generate` (run on postinstall) needs no database,
    // so a fresh clone or CI without env files must still install. Commands that do need
    // it (migrate, studio) fail with a clear error, and lib/prisma.ts checks it at runtime.
    url: process.env.DATABASE_URL,
  },
});
