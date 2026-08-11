export function calculateStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  // Normalize to unique local day strings (YYYY-MM-DD), sorted desc
  const uniqueDays = Array.from(
    new Set(dates.map((d) => new Date(d).toDateString())),
  )
    .map((d) => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const mostRecent = new Date(uniqueDays[0]);
  mostRecent.setHours(0, 0, 0, 0);

  const dayDiff = (a: Date, b: Date) =>
    Math.round((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));

  // Streak is only "current" if last completion was today or yesterday
  if (dayDiff(today, mostRecent) > 1) return 0;

  let streak = 1;
  for (let i = 0; i < uniqueDays.length - 1; i++) {
    const curr = new Date(uniqueDays[i]);
    curr.setHours(0, 0, 0, 0);
    const next = new Date(uniqueDays[i + 1]);
    next.setHours(0, 0, 0, 0);

    if (dayDiff(curr, next) === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
