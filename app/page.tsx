import { LanguageFlag } from "@/components/language-flag";
import { Button } from "@/components/ui/button";
import { LANGUAGES, type Language } from "@/lib/languages";

// TEMPORARY theme preview (step 1). Replaced by the language picker in step 5.

const ThemeSample = ({ code, nativeName }: Language) => (
  <section
    data-lang={code}
    className="border-ink bg-card shadow-brutal flex flex-col gap-5 rounded-xl border-3 p-6"
  >
    <span className="border-ink bg-accent text-accent-foreground inline-flex w-fit items-center gap-1.5 rounded-md border-2 py-0.5 pr-2 pl-1 text-xs font-bold uppercase">
      <LanguageFlag code={code} />
      {nativeName}
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

const Preview = ({ title }: { title: string }) => (
  <div className="bg-background text-foreground flex flex-col gap-6 p-6 sm:p-10">
    <h1 className="text-2xl">{title}</h1>
    <div className="grid gap-6 md:grid-cols-2">
      {LANGUAGES.map((language) => (
        <ThemeSample key={language.code} {...language} />
      ))}
    </div>
  </div>
);

const Home = () => (
  <main className="flex flex-1 flex-col">
    <Preview title="Light" />
    <div className="dark">
      <Preview title="Dark" />
    </div>
  </main>
);

export default Home;
