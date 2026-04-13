import { connectDB } from "@/lib/db";
import { AccountDistribution } from "@/lib/models/savings/AccountDistribution";
import { AccountsClient } from "@/components/accounts/AccountsClient";

export default async function AccountsPage() {
  await connectDB();
  const rows = await AccountDistribution.find().sort({ label: 1 }).lean();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Account distribution</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update balances for each bucket. The <strong className="font-medium">Bank</strong> amount
          also moves automatically: monthly entries (Kere + Ann) increase it, and deductions decrease
          it, whenever you save from the Monthly entries or Deductions pages.
        </p>
      </div>
      <AccountsClient
        accounts={rows.map((a) => ({
          id: String(a._id),
          label: a.label,
          amount: a.amount,
          updatedAt: a.updatedAt.toISOString(),
        }))}
      />
    </div>
  );
}
