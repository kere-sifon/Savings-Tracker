import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCAD } from "@/lib/money";
import type { KidsSummaryPayload } from "@/lib/kids/summary";

type Props = {
  summary: KidsSummaryPayload;
};

export function KidsSummaryCards({ summary }: Props) {
  const money = (
    title: string,
    description: string,
    value: number,
    tone: "positive" | "negative" | "neutral",
  ) => (
    <Card key={title} className="border-border/80 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <p
          className={`text-2xl font-semibold tabular-nums ${
            tone === "positive"
              ? "text-emerald-700"
              : tone === "negative"
                ? "text-red-600"
                : "text-foreground"
          }`}
        >
          {formatCAD(value)}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {money(
        "Total income",
        "All-time income transactions",
        summary.totalIncome,
        "positive",
      )}
      {money(
        "Total expenses",
        "All-time expense transactions",
        summary.totalExpenses,
        "negative",
      )}
      {money(
        "Net balance",
        "Income minus expenses (carry-forwards included)",
        summary.netBalance,
        summary.netBalance >= 0 ? "positive" : "negative",
      )}
      <Card className="border-border/80 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Coverage ratio</CardTitle>
          <p className="text-xs text-muted-foreground">
            Income ÷ expenses (higher means income covers more spend)
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold tabular-nums text-foreground">
            {summary.coverageRatio.toFixed(1)}%
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
