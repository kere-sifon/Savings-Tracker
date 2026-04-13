import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCAD } from "@/lib/money";

type Loc = { _id: string; name: string; balance: number };

type Props = {
  lines: Loc[];
  /** Sum of account distribution amounts (same as “Total across accounts” on Accounts). */
  accountsTotal: number;
};

export function LinesOfCreditSummary({ lines, accountsTotal }: Props) {
  const locTotal = lines.reduce((s, l) => s + l.balance, 0);
  const totalAvailable = accountsTotal + locTotal;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {lines.map((line) => (
        <Card key={line._id} className="border-border/80 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">{line.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums text-foreground">
              {formatCAD(line.balance)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Current balance</p>
          </CardContent>
        </Card>
      ))}
      <Card className="border-primary/30 bg-primary/5 shadow-sm lg:col-span-3">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Total available funding</CardTitle>
          <p className="text-xs text-muted-foreground">
            Total across accounts + all lines of credit.
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold tabular-nums text-primary">
            {formatCAD(totalAvailable)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
