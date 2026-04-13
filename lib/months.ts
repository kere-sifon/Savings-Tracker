export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export type MonthName = (typeof MONTHS)[number];

export const MONTH_ORDER: Record<string, number> = Object.fromEntries(
  MONTHS.map((m, i) => [m, i + 1]),
) as Record<string, number>;

export function monthIndex(month: string): number {
  return MONTH_ORDER[month] ?? 0;
}

export function compareYearMonth(
  a: { year: number; month: string },
  b: { year: number; month: string },
): number {
  if (a.year !== b.year) return a.year - b.year;
  return monthIndex(a.month) - monthIndex(b.month);
}

export function isMonthName(s: string): s is MonthName {
  return MONTH_ORDER[s] !== undefined;
}
