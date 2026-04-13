import { Deduction } from "@/lib/models/savings/Deduction";
import { MonthlyEntry } from "@/lib/models/savings/MonthlyEntry";
import { getGicReturnAmount } from "@/lib/gic-return";

export type ContributionDeductionTotals = {
  contributions: number;
  deductions: number;
  /** Snapshot from Accounts → “GIC Return” bucket. */
  gicReturn: number;
  /** Net savings for this scope (see `includeGicInNet` callers). */
  net: number;
};

export async function sumContributionsAndDeductionsForYear(
  year: number,
): Promise<ContributionDeductionTotals> {
  const [contribAgg, dedAgg, gicReturn] = await Promise.all([
    MonthlyEntry.aggregate<{ total: number }>([
      { $match: { year } },
      {
        $group: {
          _id: null,
          total: { $sum: { $add: ["$kere", "$ann"] } },
        },
      },
    ]),
    Deduction.aggregate<{ total: number }>([
      { $match: { year } },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]),
    getGicReturnAmount(),
  ]);
  const contributions = contribAgg[0]?.total ?? 0;
  const deductions = dedAgg[0]?.total ?? 0;
  return {
    contributions,
    deductions,
    gicReturn,
    net: contributions - deductions,
  };
}

export async function sumContributionsAndDeductionsAllTime(): Promise<ContributionDeductionTotals> {
  const [contribAgg, dedAgg, gicReturn] = await Promise.all([
    MonthlyEntry.aggregate<{ total: number }>([
      {
        $group: {
          _id: null,
          total: { $sum: { $add: ["$kere", "$ann"] } },
        },
      },
    ]),
    Deduction.aggregate<{ total: number }>([
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]),
    getGicReturnAmount(),
  ]);
  const contributions = contribAgg[0]?.total ?? 0;
  const deductions = dedAgg[0]?.total ?? 0;
  return {
    contributions,
    deductions,
    gicReturn,
    net: contributions + gicReturn - deductions,
  };
}
