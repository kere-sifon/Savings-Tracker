import Link from "next/link";
import { Plus } from "lucide-react";
import { connectKidsDB } from "@/lib/db-kids";
import { Transaction } from "@/lib/models/kids/Transaction";
import { KidsTransactionsClient } from "@/components/kids/transactions/KidsTransactionsClient";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function KidsTransactionsPage() {
  await connectKidsDB();
  const docs = await Transaction.find().sort({ date: -1, createdAt: -1 }).lean();
  const rows = docs.map((d) => ({
    _id: String(d._id),
    date: d.date ? new Date(d.date).toISOString() : null,
    description: d.description,
    category: d.category,
    type: d.type as "INCOME" | "EXPENSE",
    amount: d.amount,
    isCarryForward: d.isCarryForward,
    tags: d.tags ?? [],
  }));

  const yearSet = new Set<number>();
  for (const r of rows) {
    if (r.date) yearSet.add(new Date(r.date).getFullYear());
    else yearSet.add(2023);
  }
  const years = Array.from(yearSet).sort((a, b) => b - a);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Full ledger — income and expenses. Carry-forward rows shown with a badge.
          </p>
        </div>
        <Link
          href="/kids/transactions/new"
          className={cn(
            buttonVariants(),
            "inline-flex w-full items-center justify-center gap-2 sm:w-auto",
          )}
        >
          <Plus className="h-4 w-4" />
          Add transaction
        </Link>
      </div>
      <KidsTransactionsClient rows={rows} years={years} />
    </div>
  );
}
