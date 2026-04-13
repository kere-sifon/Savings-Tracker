import { connectKidsDB } from "@/lib/db-kids";
import { Transaction } from "@/lib/models/kids/Transaction";
import { computeKidsSummary } from "@/lib/kids/summary";
import { ExpensesCategoryBar } from "@/components/kids/expenses/ExpensesCategoryBar";
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

export default async function KidsExpensesPage() {
  await connectKidsDB();
  const summary = await computeKidsSummary();

  const expenseCats = summary.byCategory
    .filter((c) => c.total < 0)
    .map((c) => ({ name: c.category, total: Math.abs(c.total) }))
    .sort((a, b) => b.total - a.total);

  const txs = await Transaction.find({ type: "EXPENSE" }).lean();
  const respByYear = new Map<number, number>();
  const ymcaByYear = new Map<number, number>();
  for (const t of txs) {
    const y = t.date ? new Date(t.date).getFullYear() : 2023;
    const amt = Math.abs(t.amount);
    if (t.category === "RESP") {
      respByYear.set(y, (respByYear.get(y) ?? 0) + amt);
    }
    if (t.category === "YMCA") {
      ymcaByYear.set(y, (ymcaByYear.get(y) ?? 0) + amt);
    }
  }

  const respRows = Array.from(respByYear.entries())
    .map(([year, total]) => ({ year, total }))
    .sort((a, b) => a.year - b.year);
  const ymcaRows = Array.from(ymcaByYear.entries())
    .map(([year, total]) => ({ year, total }))
    .sort((a, b) => a.year - b.year);

  const respAvg =
    respRows.length > 0
      ? respRows.reduce((s, r) => s + r.total, 0) / respRows.length
      : 0;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Expense analysis</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Category breakdown; RESP and YMCA tracked separately.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Expenses by category</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpensesCategoryBar data={expenseCats} />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">RESP by year</CardTitle>
            <p className="text-sm text-muted-foreground">
              Avg per year (all years): {formatCAD(respAvg)}
            </p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {respRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-muted-foreground">
                      No RESP expenses yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  respRows.map((r) => (
                    <TableRow key={r.year}>
                      <TableCell>{r.year}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCAD(r.total)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">YMCA by year</CardTitle>
            <p className="text-sm text-muted-foreground">
              Zero spend in a year is a saving (e.g. 2025).
            </p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ymcaRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-muted-foreground">
                      No YMCA expenses yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  ymcaRows.map((r) => (
                    <TableRow key={r.year}>
                      <TableCell>{r.year}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCAD(r.total)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
