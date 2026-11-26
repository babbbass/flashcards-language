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
- Auth: Clerk (Core 3, `@clerk/nextjs` 7). `proxy.ts` only attaches the session; access control is resource-based: every server path reading user data calls `requireUser()` (`@/lib/auth/current-user`), which redirects to `/sign-in` and lazily upserts the `User` row (id = Clerk user id). Env vars: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`. Clerk UI is skinned in `@/lib/auth/appearance` (CSS layer `clerk`, below Tailwind utilities). With Cache Components, Clerk components that read the URL must be wrapped in `<Suspense>`.
- Env files: secrets in `.env.local` (git-ignored). Next.js loads it natively; Node scripts and the Prisma CLI load `.env.local` then `.env` via `@/lib/load-env` / `prisma.config.ts`. Import `@/lib/load-env` FIRST in scripts (ESM imports run before the module body).
- Testing auth: the Claude desktop in-app browser drops Clerk's `__client_uat` cookie, which makes the page reload in a loop after sign-in. Test signed-in flows in a regular browser.
- App pages live in the `(app)` route group: its layout wraps them in `<UserGate>` (`@/components/auth/user-gate`, inside `<Suspense>`), so nothing renders before `requireUser()` passes. Auth URLs come from `@/lib/auth/routes` (used by both `proxy.ts` and `<ClerkProvider>`).
- Routes: `/` reopens `User.lastLanguageCode` or redirects to `/languages` (picker). `/[lang]` (`en`, `es`, prerendered via `generateStaticParams`) validates the segment with `languageFromParam` (404 otherwise), sets `data-lang` on its subtree (flag palette) and records the last language. URL helpers live in `@/lib/language-route`.
- Never set `prefetch={true}` on links to `/[lang]`: its layout records the last language during render (`RememberLanguage`), so a full prefetch would save languages the user never opened.
- Language of parts (WCAG 3.1.2): the document is `lang="en"`; any text in the target language (card terms, examples) must carry `lang={language.code}`.
