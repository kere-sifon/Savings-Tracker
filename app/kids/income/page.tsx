import { connectKidsDB } from "@/lib/db-kids";
import { computeKidsSummary } from "@/lib/kids/summary";
import { IncomeByCategoryBar } from "@/components/kids/income/IncomeByCategoryBar";
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

export default async function KidsIncomePage() {
  await connectKidsDB();
  const summary = await computeKidsSummary();

  const incomeByCategory = summary.byCategory
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);

  const ccbRows = summary.ccbSummary.byYear;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Income analysis</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          CCB trend and income by category.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">CCB by year</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Year</TableHead>
                <TableHead className="text-right">Payments</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Avg</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ccbRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-muted-foreground">
                    No CCB-tagged income yet.
                  </TableCell>
                </TableRow>
              ) : (
                ccbRows.map((r) => (
                  <TableRow key={r.year}>
                    <TableCell>{r.year}</TableCell>
                    <TableCell className="text-right">{r.count}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCAD(r.total)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCAD(r.count ? r.total / r.count : 0)}
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
          <CardTitle className="text-lg">Income by source (category)</CardTitle>
        </CardHeader>
        <CardContent>
          <IncomeByCategoryBar
            data={incomeByCategory.map((c) => ({
              name: c.category,
              total: c.total,
            }))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
