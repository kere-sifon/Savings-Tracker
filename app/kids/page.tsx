import Link from "next/link";
import { Plus } from "lucide-react";
import { connectKidsDB } from "@/lib/db-kids";
import { computeKidsSummary } from "@/lib/kids/summary";
import { KidsSummaryCards } from "@/components/kids/dashboard/KidsSummaryCards";
import { KidsRunningBalanceChart } from "@/components/kids/dashboard/KidsRunningBalanceChart";
import { KidsAnnualBarChart } from "@/components/kids/dashboard/KidsAnnualBarChart";
import { KidsCategoryDonut } from "@/components/kids/dashboard/KidsCategoryDonut";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatCAD } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function KidsDashboardPage() {
  await connectKidsDB();
  const summary = await computeKidsSummary();

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Canada Child Benefit, expenses, and running net balance.
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

      <KidsSummaryCards summary={summary} />

      <Card className="border-border/80 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">CCB summary</CardTitle>
          <p className="text-xs text-muted-foreground">
            Canada Child Benefit payments tagged CCB or category CCB.
          </p>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-6 text-sm">
          <div>
            <p className="text-muted-foreground">Total CCB</p>
            <p className="text-lg font-semibold tabular-nums">
              {formatCAD(summary.ccbSummary.total)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Payments</p>
            <p className="text-lg font-semibold tabular-nums">
              {summary.ccbSummary.count}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Average</p>
            <p className="text-lg font-semibold tabular-nums">
              {formatCAD(summary.ccbSummary.avgPayment)}
            </p>
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">{summary.carryForwardNote}</p>

      <div className="grid gap-6 lg:grid-cols-2">
        <KidsRunningBalanceChart data={summary.byMonth} />
        <KidsAnnualBarChart data={summary.byYear} />
      </div>

      <KidsCategoryDonut data={summary.byCategory} />
    </div>
  );
}
