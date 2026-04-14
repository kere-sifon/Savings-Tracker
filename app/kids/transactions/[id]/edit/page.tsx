import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { connectKidsDB } from "@/lib/db-kids";
import { Transaction } from "@/lib/models/kids/Transaction";
import { TransactionForm } from "@/components/kids/transactions/TransactionForm";

export const dynamic = "force-dynamic";

export default async function EditTransactionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await connectKidsDB();
  if (!mongoose.isValidObjectId(id)) notFound();
  const doc = await Transaction.findById(id).lean();
  if (!doc) notFound();

  const dateStr = doc.date
    ? new Date(doc.date).toISOString().slice(0, 10)
    : "";

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit transaction</h1>
      </div>
      <TransactionForm
        transactionId={id}
        defaultValues={{
          date: dateStr,
          description: doc.description,
          category: doc.category,
          type: doc.type as "INCOME" | "EXPENSE",
          amount: Math.abs(doc.amount),
          tags: (doc.tags ?? []).join(", "),
          isCarryForward: doc.isCarryForward,
        }}
      />
    </div>
  );
}
