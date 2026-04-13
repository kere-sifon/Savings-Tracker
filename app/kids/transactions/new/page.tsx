import { TransactionForm } from "@/components/kids/transactions/TransactionForm";

export default function NewTransactionPage() {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">New transaction</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          RESP and YMCA categories are set automatically when the description matches.
        </p>
      </div>
      <TransactionForm />
    </div>
  );
}
