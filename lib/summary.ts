import { compareYearMonth, MONTHS } from "@/lib/months";
import { Deduction } from "@/lib/models/savings/Deduction";
import { getGicReturnAmount } from "@/lib/gic-return";
import { MonthlyEntry } from "@/lib/models/savings/MonthlyEntry";
import { getOrCreateSettings } from "@/lib/models/savings/Settings";
import { groupDeductionsByMonth, monthDeductionKey } from "@/lib/deduction-utils";

export type RunningMonthPoint = {
  year: number;
  month: string;
  balance: number;
};

export type SummaryPayload = {
  totalSavings: number;
  netBalance: number;
  totalContributionsAllTime: number;
  /** GIC Return bucket (Accounts); included in net balance and all-time contributions. */
  gicReturn: number;
  totalDeductionsAllTime: number;
  totalContributionsYtd: number;
  totalDeductionsYtd: number;
  runningBalanceByMonth: RunningMonthPoint[];
};

function entryKey(year: number, month: string): string {
  return `${year}-${month}`;
}

export async function computeSummary(): Promise<SummaryPayload> {
  const settings = await getOrCreateSettings();
  const startingBalance = settings.startingBalance;

  const [rawEntries, rawDeductions, gicReturn] = await Promise.all([
    MonthlyEntry.find().lean(),
    Deduction.find().lean(),
    getGicReturnAmount(),
  ]);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthIndex = now.getMonth() + 1;
  const asOf: { year: number; month: string } = {
    year: currentYear,
    month: MONTHS[currentMonthIndex - 1],
  };

  const entries = rawEntries
    .filter((e) => compareYearMonth(e, asOf) <= 0)
    .sort((a, b) => compareYearMonth(a, b));
  const allDeductions = rawDeductions.filter(
    (d) => compareYearMonth(d, asOf) <= 0,
  );

  const dedByMonth = groupDeductionsByMonth(allDeductions);

  const monthDeductionTotal = (y: number, m: string): number => {
    const list = dedByMonth.get(monthDeductionKey(y, m)) ?? [];
    return list.reduce((s, d) => s + d.amount, 0);
  };

  let totalContributionsAllTime = 0;
  let totalDeductionsAllTime = 0;

  for (const d of allDeductions) {
    totalDeductionsAllTime += d.amount;
  }

  const entryMap = new Map<string, (typeof entries)[0]>();
  for (const e of entries) {
    totalContributionsAllTime += e.kere + e.ann;
    entryMap.set(entryKey(e.year, e.month), e);
  }
  totalContributionsAllTime += gicReturn;

  let totalContributionsYtd = 0;
  let totalDeductionsYtd = 0;
  for (const e of entries) {
    if (e.year !== currentYear) continue;
    totalContributionsYtd += e.kere + e.ann;
  }
  for (const d of allDeductions) {
    if (d.year !== currentYear) continue;
    totalDeductionsYtd += d.amount;
  }

  const totalSavings = totalContributionsYtd - totalDeductionsYtd;

  const runningBalanceByMonth: RunningMonthPoint[] = [];
  let running = startingBalance;

  const endYear = currentYear;
  const endMonthIndex = currentMonthIndex;

  const startYear = Math.min(
    2022,
    ...entries.map((e) => e.year),
    ...allDeductions.map((d) => d.year),
  );

  for (let y = startYear; y <= endYear; y++) {
    const lastM = y === endYear ? endMonthIndex : 12;
    for (let mi = 1; mi <= lastM; mi++) {
      const monthName = MONTHS[mi - 1];
      const e = entryMap.get(entryKey(y, monthName));
      if (e) {
        running += e.kere + e.ann;
      }
      running -= monthDeductionTotal(y, monthName);
      runningBalanceByMonth.push({
        year: y,
        month: monthName,
        balance: running,
      });
    }
  }

  running += gicReturn;
  const netBalance = running;
  if (runningBalanceByMonth.length > 0) {
    const i = runningBalanceByMonth.length - 1;
    runningBalanceByMonth[i] = {
      ...runningBalanceByMonth[i],
      balance: running,
    };
  }

  return {
    totalSavings,
    netBalance,
    totalContributionsAllTime,
    gicReturn,
    totalDeductionsAllTime,
    totalContributionsYtd,
    totalDeductionsYtd,
    runningBalanceByMonth,
  };
}

export function sortEntriesForList<
  T extends { year: number; month: string },
>(items: T[]): T[] {
  return [...items].sort((a, b) => -compareYearMonth(a, b));
}
