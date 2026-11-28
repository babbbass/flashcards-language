type Props = {
  translation: string;
  /** Language of the translation (WCAG 3.1.2). */
  nativeLanguage: string;
};

/** The meaning in the user's own language. */
export const CardTranslation = ({ translation, nativeLanguage }: Props) => (
  <p lang={nativeLanguage} className="text-2xl font-bold">
    {translation}
  </p>
);
