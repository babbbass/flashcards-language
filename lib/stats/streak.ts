import { addDays, type LocalDay } from "@/lib/dates";

/**
 * Number of consecutive days with at least one review, ending today.
 * If today has no review yet, the streak is still alive from yesterday (it only breaks
 * once a full day passes without a review).
 */
export const computeStreak = (reviewedDays: ReadonlySet<LocalDay>, today: LocalDay) => {
  let day = reviewedDays.has(today) ? today : addDays(today, -1);
  let streak = 0;
  while (reviewedDays.has(day)) {
    streak += 1;
    day = addDays(day, -1);
  }
  return streak;
};
