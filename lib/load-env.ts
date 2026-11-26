import { config } from "dotenv";

/**
 * Side-effect module for Node scripts (Next.js loads env files on its own):
 * same files and priority as Next.js, `.env.local` (secrets, git-ignored) then `.env`.
 * Import it FIRST (`import "@/lib/load-env"`) so variables exist before other modules read them.
 */
config({ path: [".env.local", ".env"], quiet: true });
