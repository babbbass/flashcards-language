import { Protected } from "@/components/auth/protected";
import { LanguageShell } from "@/components/language-shell";
import { RootDocument, siteMetadata } from "@/components/root-document";
import { findLanguage, languageStaticParams } from "@/lib/language-route";

export const generateStaticParams = languageStaticParams;

export const metadata = siteMetadata;

type Props = LayoutProps<"/[lang]">;

/**
 * Root layout of everything under `/en`, `/es`…: the page itself is declared in the
 * language studied (`<html lang>`, WCAG 3.1.1), and the whole universe is signed-in only.
 *
 * An unknown code (`/xx`) must not throw here: `notFound()` from a root layout falls back to
 * Next's bare default 404. The layout renders a plain English document instead and the page's
 * `languageFromParam` throws, which `app/[lang]/not-found.tsx` renders with the app's 404.
 */
const LanguageRootLayout = async ({ children, params }: Props) => {
  const language = findLanguage((await params).lang);

  if (!language) {
    return <RootDocument lang="en">{children}</RootDocument>;
  }

  return (
    <RootDocument lang={language.code}>
      <Protected>
        <LanguageShell language={language}>{children}</LanguageShell>
      </Protected>
    </RootDocument>
  );
};

export default LanguageRootLayout;
