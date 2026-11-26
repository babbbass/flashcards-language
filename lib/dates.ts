/**
 * Calendar-day helpers in a given IANA timezone ("Europe/Paris").
 * A day is represented as an ISO date string "YYYY-MM-DD": comparable, sortable, Set-friendly.
 */
export type LocalDay = string;

const DAY_MS = 24 * 60 * 60 * 1000;

/** The calendar day of `date` as seen in `timeZone`. */
export const toLocalDay = (date: Date, timeZone: string): LocalDay =>
  // en-CA formats as YYYY-MM-DD
  new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

/** Day arithmetic on the calendar (timezone-free once we hold a LocalDay). */
export const addDays = (day: LocalDay, amount: number): LocalDay =>
  new Date(Date.parse(`${day}T00:00:00Z`) + amount * DAY_MS).toISOString().slice(0, 10);

/** Monday (0) … Sunday (6). */
const weekdayIndex = (day: LocalDay) => (new Date(`${day}T00:00:00Z`).getUTCDay() + 6) % 7;

/** The seven days (Monday → Sunday) of the week containing `day`. */
export const weekOf = (day: LocalDay): LocalDay[] => {
  const monday = addDays(day, -weekdayIndex(day));
  return Array.from({ length: 7 }, (_, index) => addDays(monday, index));
};

/** Short weekday label in a locale: "Mon" (en-GB), "lun" (es-ES)… */
export const weekdayLabel = (day: LocalDay, locale: string) =>
  new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" }).format(
    new Date(`${day}T00:00:00Z`),
  );
