const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;

/** Unit, its length, and how many of it before switching to the next unit. */
const UNITS = [
  { unit: "minute", size: MINUTE, limit: 60 },
  { unit: "hour", size: 60 * MINUTE, limit: 24 },
  { unit: "day", size: DAY, limit: 30 },
  { unit: "month", size: 30 * DAY, limit: 12 },
  { unit: "year", size: 365 * DAY, limit: Number.POSITIVE_INFINITY },
] as const;

/** Time until the next review, short and localised: "10 min", "3 days", "2 mths". */
export const formatInterval = (from: Date, to: Date, locale: string) => {
  const ms = Math.max(to.getTime() - from.getTime(), MINUTE);
  const { unit, size } = UNITS.find(({ size, limit }) => ms / size < limit) ?? UNITS[4];
  return new Intl.NumberFormat(locale, {
    style: "unit",
    unit,
    unitDisplay: "short",
    maximumFractionDigits: 0,
  }).format(Math.round(ms / size));
};
