/**
 * Imports the card catalog from `content/<lang>/<deck>.json` into the database.
 *
 *   pnpm cards:import            validate everything, then write
 *   pnpm cards:import --dry-run  validate only
 *
 * Idempotent: languages, decks and cards are upserted by stable keys, so running it
 * twice changes nothing. Cards removed from a file are NOT deleted (users may have
 * progress on them); they are only reported.
 */
import "dotenv/config";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import {
  type CardFile,
  cardKey,
  type DeckFile,
  deckFileSchema,
  KEBAB_CASE,
} from "@/lib/content/deck-schema";
import { isLanguageCode, LANGUAGES, type LanguageCode } from "@/lib/languages";
import { prisma } from "@/lib/prisma";

const CONTENT_DIR = path.join(process.cwd(), "content");

type ParsedDeck = {
  file: string;
  languageCode: LanguageCode;
  slug: string;
  deck: DeckFile;
};

type DeckReport = {
  file: string;
  created: number;
  refreshed: number;
  stale: string[];
};

// ─── Read & validate ─────────────────────────────────────────────────────────

const isMissingFileError = (error: unknown) =>
  error instanceof Error && "code" in error && error.code === "ENOENT";

const listDeckFiles = async () => {
  const languageDirs = await readdir(CONTENT_DIR, { withFileTypes: true }).catch(
    (error: unknown) => {
      if (isMissingFileError(error)) {
        throw new Error(`${CONTENT_DIR} not found: run the script from the project root`, {
          cause: error,
        });
      }
      throw error;
    },
  );
  const files = await Promise.all(
    languageDirs
      .filter((entry) => entry.isDirectory())
      .map(async (dir) => {
        const entries = await readdir(path.join(CONTENT_DIR, dir.name));
        return entries
          .filter((name) => name.endsWith(".json"))
          .map((name) => ({ languageDir: dir.name, fileName: name }));
      }),
  );
  return files.flat();
};

const parseDeckFile = async (languageDir: string, fileName: string): Promise<ParsedDeck> => {
  const file = path.join("content", languageDir, fileName);

  if (!isLanguageCode(languageDir)) {
    throw new Error(`${file}: unknown language "${languageDir}" (add it to lib/languages.ts)`);
  }

  const slug = path.basename(fileName, ".json");
  if (!KEBAB_CASE.test(slug)) {
    throw new Error(
      `${file}: file name must be kebab-case (it becomes the deck slug, e.g. small-talk.json)`,
    );
  }

  const raw = await readFile(path.join(CONTENT_DIR, languageDir, fileName), "utf8");
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch (error) {
    throw new Error(`${file}: invalid JSON`, { cause: error });
  }

  const result = deckFileSchema.safeParse(json);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n");
    throw new Error(`${file}: invalid deck\n${issues}`);
  }

  const keys = result.data.cards.map((card) => cardKey(languageDir, slug, card));
  const duplicates = keys.filter((key, index) => keys.indexOf(key) !== index);
  if (duplicates.length > 0) {
    throw new Error(
      `${file}: duplicate cards ${[...new Set(duplicates)].join(", ")} (set a distinct "id")`,
    );
  }

  return { file, languageCode: languageDir, slug, deck: result.data };
};

/** Validates every file first: nothing is written if a single file is wrong. */
const readAllDecks = async () => {
  const files = await listDeckFiles();
  const results = await Promise.allSettled(
    files.map(({ languageDir, fileName }) => parseDeckFile(languageDir, fileName)),
  );

  const errors = results.flatMap((result) =>
    result.status === "rejected"
      ? [result.reason instanceof Error ? result.reason.message : String(result.reason)]
      : [],
  );
  if (errors.length > 0) {
    throw new Error(`Validation failed:\n\n${errors.join("\n\n")}`);
  }

  return results.flatMap((result) => (result.status === "fulfilled" ? [result.value] : []));
};

// ─── Write ───────────────────────────────────────────────────────────────────

const upsertLanguages = () =>
  prisma.$transaction(
    LANGUAGES.map((language) =>
      prisma.language.upsert({
        where: { code: language.code },
        create: language,
        update: language,
      }),
    ),
  );

/** Optional fields are written as null when absent, so removing them from a file clears them. */
const cardData = (card: CardFile) => ({
  term: card.term,
  translation: card.translation,
  example: card.example ?? null,
  exampleTranslation: card.exampleTranslation ?? null,
  phonetic: card.phonetic ?? null,
  partOfSpeech: card.partOfSpeech ?? null,
  note: card.note ?? null,
});

const importDeck = ({ file, languageCode, slug, deck }: ParsedDeck) =>
  prisma.$transaction(
    async (tx) => {
      const { id: deckId } = await tx.deck.upsert({
        where: { languageCode_slug: { languageCode, slug } },
        create: { languageCode, slug, name: deck.name, description: deck.description ?? null },
        update: { name: deck.name, description: deck.description ?? null },
      });

      const existingKeys = new Set(
        (await tx.card.findMany({ where: { deckId, key: { not: null } }, select: { key: true } }))
          .map((card) => card.key)
          .filter((key) => key !== null),
      );

      const fileKeys = new Set<string>();
      for (const card of deck.cards) {
        const key = cardKey(languageCode, slug, card);
        fileKeys.add(key);
        await tx.card.upsert({
          where: { key },
          create: { key, deckId, ...cardData(card) },
          update: cardData(card),
        });
      }

      const report: DeckReport = {
        file,
        created: [...fileKeys].filter((key) => !existingKeys.has(key)).length,
        refreshed: [...fileKeys].filter((key) => existingKeys.has(key)).length,
        stale: [...existingKeys].filter((key) => !fileKeys.has(key)),
      };
      return report;
    },
    // Default is 5 s; on Turso every upsert is a network round trip, so a large deck needs more.
    { maxWait: 10_000, timeout: 60_000 },
  );

// ─── Main ────────────────────────────────────────────────────────────────────

const main = async () => {
  const dryRun = process.argv.includes("--dry-run");
  const decks = await readAllDecks();
  const cardCount = decks.reduce((total, { deck }) => total + deck.cards.length, 0);
  console.log(`✔ ${decks.length} deck(s), ${cardCount} card(s) valid`);

  if (dryRun) {
    console.log("Dry run: nothing written.");
    return;
  }

  await upsertLanguages();
  console.log(`✔ ${LANGUAGES.length} language(s) upserted`);

  for (const parsed of decks) {
    const report = await importDeck(parsed);
    console.log(
      `✔ ${report.file}: ${report.created} new, ${report.refreshed} already present (refreshed)`,
    );
    if (report.stale.length > 0) {
      console.warn(
        `  ⚠ ${report.stale.length} card(s) in the database but no longer in the file (kept): ${report.stale.join(", ")}`,
      );
    }
  }
};

main()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
