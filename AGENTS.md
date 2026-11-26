<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project rules

- Imports: always absolute with the `@/` alias (maps to the project root, e.g. `@/components/ui/button`, `@/lib/utils`). Never relative.
- Package manager: pnpm. TypeScript 6.0 (pinned `~6.0`: typescript-eslint does not support TS 7 yet).
- Database: Prisma 7 + SQLite through the libSQL adapter (`@/lib/prisma`). Generated client in `generated/prisma` (git-ignored, rebuilt on `postinstall`). Env vars: `DATABASE_URL`, `DATABASE_AUTH_TOKEN` (Turso only).
- Theme: neo-brutalist. Colors come from CSS variables in `app/globals.css`; the per-language palette is set with `data-lang="en|es"`, dark mode with the `.dark` class. Use `border-ink`, `shadow-brutal*`, `font-heading` instead of hard-coded values.
