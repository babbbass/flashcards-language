import { UserButton } from "@clerk/nextjs";
import { LanguageTile } from "@/components/language-tile";
import { LANGUAGES } from "@/lib/languages";

/** Language picker: the entry point of the app when no language was chosen yet. */
const LanguagesPage = () => (
  <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-10 p-6">
    <header className="flex justify-end">
      <UserButton />
    </header>
    <div className="flex flex-col gap-2">
      <h1 className="text-4xl sm:text-5xl">Which language do you want to learn?</h1>
      <p className="text-muted-foreground">You can switch anytime from the flag at the top.</p>
    </div>
    <nav aria-label="Languages" className="flex flex-col gap-5">
      {LANGUAGES.map((language) => (
        <LanguageTile key={language.code} language={language} />
      ))}
    </nav>
  </main>
);

export default LanguagesPage;
