import { connectKidsDB } from "@/lib/db-kids";
import { computeKidsSummary } from "@/lib/kids/summary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCAD } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function KidsMonthlySummaryPage() {
  await connectKidsDB();
  const summary = await computeKidsSummary();

  const surplus = summary.byMonth.filter((m) => m.net >= 0).length;
  const deficit = summary.byMonth.filter((m) => m.net < 0).length;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Monthly summary</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Net per month and running balance. Green = surplus, red = deficit.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Surplus months</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-emerald-700">{surplus}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Deficit months</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-red-600">{deficit}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">By month</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead className="text-right">Income</TableHead>
                <TableHead className="text-right">Expenses</TableHead>
                <TableHead className="text-right">Net</TableHead>
                <TableHead className="text-right">Running</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summary.byMonth.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-muted-foreground">
                    No data yet.
                  </TableCell>
                </TableRow>
              ) : (
                summary.byMonth.map((m) => (
                  <TableRow
                    key={m.ym}
                    className={
                      m.net >= 0
                        ? "bg-emerald-50/80 dark:bg-emerald-950/20"
                        : "bg-red-50/80 dark:bg-red-950/20"
                    }
                  >
                    <TableCell className="font-medium">{m.ym}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCAD(m.income)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCAD(m.expenses)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-medium">
                      {formatCAD(m.net)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCAD(m.runningBalance)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
