import { connectDB } from "@/lib/db";
import { AccountDistribution } from "@/lib/models/savings/AccountDistribution";
import { LineOfCredit } from "@/lib/models/savings/LineOfCredit";
import { CreditClient } from "@/components/credit/CreditClient";

export default async function CreditPage() {
  await connectDB();
  const [locs, accounts] = await Promise.all([
    LineOfCredit.find().sort({ name: 1 }).lean(),
    AccountDistribution.find().sort({ label: 1 }).lean(),
  ]);

  const accountsTotal = accounts.reduce((s, a) => s + a.amount, 0);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Lines of credit</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track LOC balances. Total available funding is total across accounts plus lines of credit.
        </p>
      </div>
      <CreditClient
        lines={locs.map((l) => ({
          id: String(l._id),
          name: l.name,
          balance: l.balance,
          updatedAt: l.updatedAt.toISOString(),
        }))}
        accountsTotal={accountsTotal}
      />
    </div>
  );
}
