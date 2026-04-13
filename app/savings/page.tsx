import Link from "next/link";
import { Plus } from "lucide-react";
import { DistributionChart } from "@/components/dashboard/DistributionChart";
import { LinesOfCreditSummary } from "@/components/dashboard/LinesOfCreditSummary";
import { RunningBalanceChart } from "@/components/dashboard/RunningBalanceChart";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { connectDB } from "@/lib/db";
import { AccountDistribution } from "@/lib/models/savings/AccountDistribution";
import { LineOfCredit } from "@/lib/models/savings/LineOfCredit";
import { getOrCreateSettings } from "@/lib/models/savings/Settings";
import { computeSummary } from "@/lib/summary";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  await connectDB();
  const [summary, settings, accounts, locs] = await Promise.all([
    computeSummary(),
    getOrCreateSettings(),
    AccountDistribution.find().sort({ label: 1 }).lean(),
    LineOfCredit.find().sort({ name: 1 }).lean(),
  ]);

  const partner1Name = settings.partner1Name;
  const partner2Name = settings.partner2Name;
  const accountsTotal = accounts.reduce((s, a) => s + a.amount, 0);
  const bankAndFshaLabels = new Set(["Bank", "FSHA"]);
  const bankAndFshaTotal = accounts
    .filter((a) => bankAndFshaLabels.has(a.label))
    .reduce((s, a) => s + a.amount, 0);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Household savings, contributions, and account snapshot.
          </p>
        </div>
        <Link
          href="/savings/entries/new"
          className={cn(
            buttonVariants(),
            "inline-flex w-full items-center justify-center gap-2 sm:w-auto",
          )}
        >
          <Plus className="h-4 w-4" />
          Add monthly entry
        </Link>
      </div>

      <SummaryCards
        summary={summary}
        partner1Name={partner1Name}
        partner2Name={partner2Name}
        bankAndFshaTotal={bankAndFshaTotal}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <RunningBalanceChart data={summary.runningBalanceByMonth} />
        <DistributionChart
          accounts={accounts.map((a) => ({
            _id: String(a._id),
            label: a.label,
            amount: a.amount,
          }))}
        />
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Lines of credit</h2>
        <LinesOfCreditSummary
          lines={locs.map((l) => ({
            _id: String(l._id),
            name: l.name,
            balance: l.balance,
          }))}
          accountsTotal={accountsTotal}
        />
      </section>
    </div>
  );
}
