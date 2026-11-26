<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project rules

- Component props: a component's own props type is named `Props` (`type Props = { … }`, then `({ … }: Props)`), never `<Component>Props` or an inline object type. One component with its own props per file; framework/library types (`LayoutProps<"/">`, shadcn primitives) stay as they are.
- Imports: always absolute with the `@/` alias (maps to the project root, e.g. `@/components/ui/button`, `@/lib/utils`). Never relative.
- Package manager: pnpm. TypeScript 7 (native compiler).
- Lint & format: Biome (`biome.json`), no ESLint/Prettier. `pnpm lint` checks, `pnpm format` writes fixes (format, Tailwind class order, import order), `pnpm typecheck` runs tsc. Markdown is not formatted.
- Database: Prisma 7 + SQLite through the libSQL adapter (`@/lib/prisma`). Generated client in `generated/prisma` (git-ignored, rebuilt on `postinstall`). Env vars: `DATABASE_URL`, `DATABASE_AUTH_TOKEN` (Turso only).
- Theme: neo-brutalist. Colors come from CSS variables in `app/globals.css`; the per-language palette is set with `data-lang="en|es"`, dark mode with the `.dark` class. Use `border-ink`, `shadow-brutal*`, `font-heading` instead of hard-coded values.
- Content: the card catalog lives in `content/<lang>/<deck-slug>.json` (format and validation in `@/lib/content/deck-schema`), languages in `@/lib/languages`. `pnpm cards:import` (or `--dry-run`) upserts it idempotently; card key = `<lang>/<deck>/<id or slug(term)>`, so renaming a `term` needs an explicit `id` to keep user progress. Cards removed from a file are reported, never deleted.
- Assets: static images live in `assets/` (e.g. `assets/svg/flags/<iso-3166-country>.svg`), statically imported and rendered with `next/image` (Next serves SVGs unoptimized, as-is, with a hashed cache-busting URL). `public/` is only for files that need a fixed URL (favicon, manifest, robots).
