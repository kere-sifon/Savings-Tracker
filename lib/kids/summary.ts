import { Transaction } from "@/lib/models/kids/Transaction";

const NULL_DATE = new Date("2023-01-01T00:00:00.000Z");

function sortKey(date: Date | null | undefined): number {
  const d = date ? new Date(date) : NULL_DATE;
  return d.getTime();
}

function ymKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function signedAmount(t: {
  type: string;
  amount: number;
}): number {
  return t.type === "INCOME" ? t.amount : -Math.abs(t.amount);
}

export type KidsSummaryPayload = {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  coverageRatio: number;
  byYear: { year: number; income: number; expenses: number; net: number }[];
  byMonth: {
    ym: string;
    income: number;
    expenses: number;
    net: number;
    runningBalance: number;
  }[];
  byCategory: { category: string; total: number }[];
  ccbSummary: {
    total: number;
    count: number;
    avgPayment: number;
    byYear: { year: number; total: number; count: number }[];
  };
  topExpenses: { description: string; total: number; count: number }[];
  carryForwardNote: string;
};

export async function computeKidsSummary(): Promise<KidsSummaryPayload> {
  const raw = await Transaction.find().lean();
  const docs = [...raw].sort(
    (a, b) => sortKey(a.date) - sortKey(b.date),
  );

  let totalIncome = 0;
  let totalExpenses = 0;
  for (const t of docs) {
    if (t.type === "INCOME") totalIncome += t.amount;
    else totalExpenses += Math.abs(t.amount);
  }
  const netBalance = totalIncome - totalExpenses;
  const coverageRatio =
    totalExpenses <= 0
      ? totalIncome > 0
        ? 100
        : 0
      : Math.round((totalIncome / totalExpenses) * 1000) / 10;

  const yearMap = new Map<number, { income: number; expenses: number }>();
  const monthAgg = new Map<
    string,
    { income: number; expenses: number; sort: number }
  >();
  const catMap = new Map<string, number>();
  const ccbRows: { amount: number; date: Date | null }[] = [];
  const expenseByDesc = new Map<string, { total: number; count: number }>();

  for (const t of docs) {
    const d = t.date ? new Date(t.date) : NULL_DATE;
    const y = d.getFullYear();
    if (!yearMap.has(y)) yearMap.set(y, { income: 0, expenses: 0 });
    const yv = yearMap.get(y)!;
    const mk = ymKey(d);
    if (!monthAgg.has(mk)) {
      monthAgg.set(mk, { income: 0, expenses: 0, sort: d.getTime() });
    }
    const mv = monthAgg.get(mk)!;

    const isCcb =
      t.tags?.some((x) => x.toUpperCase() === "CCB") ||
      t.category === "CCB";

    if (t.type === "INCOME") {
      yv.income += t.amount;
      mv.income += t.amount;
      if (isCcb) ccbRows.push({ amount: t.amount, date: t.date ?? null });
    } else {
      yv.expenses += Math.abs(t.amount);
      mv.expenses += Math.abs(t.amount);
      const desc = t.description.trim() || "(no description)";
      const cur = expenseByDesc.get(desc) ?? { total: 0, count: 0 };
      cur.total += Math.abs(t.amount);
      cur.count += 1;
      expenseByDesc.set(desc, cur);
    }

    const cat = t.category || "Other";
    catMap.set(cat, (catMap.get(cat) ?? 0) + signedAmount(t));
  }

  const byYear = Array.from(yearMap.entries())
    .map(([year, v]) => ({
      year,
      income: v.income,
      expenses: v.expenses,
      net: v.income - v.expenses,
    }))
    .sort((a, b) => a.year - b.year);

  const monthLastRunning = new Map<string, number>();
  let running = 0;
  for (const t of docs) {
    running += signedAmount(t);
    const d = t.date ? new Date(t.date) : NULL_DATE;
    monthLastRunning.set(ymKey(d), running);
  }

  const monthKeys = Array.from(monthAgg.entries()).sort(
    (a, b) => a[1].sort - b[1].sort,
  );
  const byMonth: KidsSummaryPayload["byMonth"] = [];
  for (const [ym, v] of monthKeys) {
    const net = v.income - v.expenses;
    byMonth.push({
      ym,
      income: v.income,
      expenses: v.expenses,
      net,
      runningBalance: monthLastRunning.get(ym) ?? running,
    });
  }

  const byCategory = Array.from(catMap.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => Math.abs(b.total) - Math.abs(a.total));

  const ccbTotal = ccbRows.reduce((s, r) => s + r.amount, 0);
  const ccbCount = ccbRows.length;
  const ccbByYear = new Map<number, { total: number; count: number }>();
  for (const r of ccbRows) {
    const y = r.date ? new Date(r.date).getFullYear() : NULL_DATE.getFullYear();
    if (!ccbByYear.has(y)) ccbByYear.set(y, { total: 0, count: 0 });
    const cv = ccbByYear.get(y)!;
    cv.total += r.amount;
    cv.count += 1;
  }

  const topExpenses = Array.from(expenseByDesc.entries())
    .map(([description, v]) => ({
      description,
      total: v.total,
      count: v.count,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 15);

  const cfIncome = docs
    .filter((t) => t.isCarryForward && t.type === "INCOME")
    .reduce((s, t) => s + t.amount, 0);
  const cfExp = docs
    .filter((t) => t.isCarryForward && t.type === "EXPENSE")
    .reduce((s, t) => s + Math.abs(t.amount), 0);

  return {
    totalIncome,
    totalExpenses,
    netBalance,
    coverageRatio,
    byYear,
    byMonth,
    byCategory,
    ccbSummary: {
      total: ccbTotal,
      count: ccbCount,
      avgPayment: ccbCount ? ccbTotal / ccbCount : 0,
      byYear: Array.from(ccbByYear.entries())
        .map(([year, v]) => ({ year, total: v.total, count: v.count }))
        .sort((a, b) => a.year - b.year),
    },
    topExpenses,
    carryForwardNote: `Opening entries included: +${cfIncome.toLocaleString("en-CA", { style: "currency", currency: "CAD" })} income / −${cfExp.toLocaleString("en-CA", { style: "currency", currency: "CAD" })} expenses`,
  };
}
