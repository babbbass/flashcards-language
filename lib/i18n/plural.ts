type Forms = {
  one: string;
  other: string;
};

/**
 * Picks the singular or plural form for a count, following the locale's rules
 * (`Intl.PluralRules`): `pluralize("es")(1, { one: "día", other: "días" })` → "día".
 */
export const pluralize = (locale: string) => {
  const rules = new Intl.PluralRules(locale);
  return (count: number, forms: Forms) => (rules.select(count) === "one" ? forms.one : forms.other);
};
