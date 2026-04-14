import { connectDB } from "@/lib/db";
import { Deduction } from "@/lib/models/savings/Deduction";
import { compareYearMonth } from "@/lib/months";
import { formatCAD } from "@/lib/money";
import { DeductionsClient } from "@/components/deductions/DeductionsClient";

export const dynamic = "force-dynamic";

type SearchParams = { edit?: string; year?: string; month?: string };

export default async function DeductionsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  await connectDB();
  const docs = await Deduction.find().lean();
  docs.sort((a, b) => -compareYearMonth(a, b));

  const initial = docs.map((d) => ({
    id: String(d._id),
    year: d.year,
    month: d.month,
    amount: d.amount,
    description: d.description,
  }));

  const totalDeductionsAllTime = docs.reduce((s, d) => s + d.amount, 0);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Deductions</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Independent of monthly entries. Assign each line to a month for reporting; totals
          feed net savings on the dashboard and Monthly entries page.
        </p>
      </div>
      <div className="rounded-lg border border-border bg-card px-4 py-3">
        <p className="text-xs font-medium text-muted-foreground">
          Total deductions (all time)
        </p>
        <p className="mt-1 text-2xl font-bold tabular-nums text-red-600">
          {formatCAD(totalDeductionsAllTime)}
        </p>
      </div>
      <DeductionsClient
        initial={initial}
        prefillYear={sp.year}
        prefillMonth={sp.month}
        editId={sp.edit}
      />
    </div>
  );
}
