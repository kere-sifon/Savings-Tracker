import { connectDB } from "@/lib/db";
import { MonthlyEntry } from "@/lib/models/savings/MonthlyEntry";
import { loadAllEntriesPage, loadYearRows } from "@/lib/load-entries";
import {
  sumContributionsAndDeductionsAllTime,
  sumContributionsAndDeductionsForYear,
} from "@/lib/entry-totals";
import { EntriesTable } from "@/components/entries/EntriesTable";
import { EntriesToolbar } from "@/components/entries/EntriesToolbar";
import { EntriesTotalsSummary } from "@/components/entries/EntriesTotalsSummary";

type SearchParams = { year?: string; view?: string; page?: string };

export const dynamic = "force-dynamic";

export default async function EntriesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await connectDB();
  const now = new Date();
  const currentYear = now.getFullYear();

  const viewAll = searchParams.view === "all";
  const page = Math.max(1, parseInt(searchParams.page || "1", 10));
  const yearFromQuery = searchParams.year
    ? parseInt(searchParams.year, 10)
    : NaN;
  const selectedYear = !Number.isNaN(yearFromQuery) ? yearFromQuery : currentYear;

  const years = (await MonthlyEntry.distinct("year")).sort((a, b) => b - a);
  if (!years.includes(currentYear)) {
    years.unshift(currentYear);
    years.sort((a, b) => b - a);
  }

  if (viewAll) {
    const [{ rows, totalPages, total, page: p }, totals] = await Promise.all([
      loadAllEntriesPage(page, 12),
      sumContributionsAndDeductionsAllTime(),
    ]);
    return (
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Monthly entries</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Partner contributions by month. Deductions are tracked separately; totals below
            show net savings (contributions − deductions).
          </p>
        </div>
        <EntriesTotalsSummary
          totalContributions={totals.contributions}
          totalDeductions={totals.deductions}
          gicReturn={totals.gicReturn}
          includeGicInNet
          scopeLabel="all years"
        />
        <EntriesToolbar
          years={years}
          selectedYear={selectedYear}
          mode="all"
        />
        <EntriesTable
          rows={rows}
          pagination={{ page: p, totalPages, total }}
        />
      </div>
    );
  }

  const [rows, totals] = await Promise.all([
    loadYearRows(selectedYear, now),
    sumContributionsAndDeductionsForYear(selectedYear),
  ]);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Monthly entries</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Calendar view for the selected year. Future months appear as placeholders.
        </p>
      </div>
      <EntriesTotalsSummary
        totalContributions={totals.contributions}
        totalDeductions={totals.deductions}
        gicReturn={totals.gicReturn}
        includeGicInNet={false}
        scopeLabel={String(selectedYear)}
      />
      <EntriesToolbar
        years={years}
        selectedYear={selectedYear}
        mode="year"
      />
      <EntriesTable rows={rows} pagination={null} />
    </div>
  );
}
