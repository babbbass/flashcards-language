import { languageFromParam } from "@/lib/language-route";

type Props = PageProps<"/[lang]">;

/** TEMPORARY language home (step 5). The real home (hero card, streak) comes in step 6. */
const LanguageHomePage = async ({ params }: Props) => {
  const language = languageFromParam((await params).lang);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-primary text-5xl">{language.name}</h1>
      <p className="text-muted-foreground">Your {language.name} home is coming in the next step.</p>
    </main>
  );
};

export default LanguageHomePage;
