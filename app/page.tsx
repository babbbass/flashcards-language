import { Button } from "@/components/ui/button";

// TEMPORARY theme preview (step 1). Replaced by the language picker in step 5.
const PALETTES = [
  { lang: "en", label: "English" },
  { lang: "es", label: "Español" },
] as const;

function ThemeSample({ lang, label }: (typeof PALETTES)[number]) {
  return (
    <section
      data-lang={lang}
      className="flex flex-col gap-5 rounded-xl border-3 border-ink bg-card p-6 shadow-brutal"
    >
      <span className="w-fit rounded-md border-2 border-ink bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground uppercase">
        {label}
      </span>
      <div>
        <h2 className="text-4xl">How are you?</h2>
        <p className="text-muted-foreground">Comment vas-tu ?</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button size="lg">Learn the list</Button>
        <Button size="lg" variant="accent">
          Review
        </Button>
        <Button size="lg" variant="outline">
          Skip
        </Button>
      </div>
    </section>
  );
}

function Preview({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-6 bg-background p-6 text-foreground sm:p-10">
      <h1 className="text-2xl">{title}</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {PALETTES.map((palette) => (
          <ThemeSample key={palette.lang} {...palette} />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Preview title="Light" />
      <div className="dark">
        <Preview title="Dark" />
      </div>
    </main>
  );
}
