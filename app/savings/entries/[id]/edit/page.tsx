import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { MonthlyEntry } from "@/lib/models/savings/MonthlyEntry";
import { EntryForm } from "@/components/entries/EntryForm";
import type { MonthlyEntryInput } from "@/lib/schemas/entry";

type Props = { params: Promise<{ id: string }> };

export default async function EditEntryPage({ params }: Props) {
  const { id } = await params;
  await connectDB();
  const doc = await MonthlyEntry.findById(id).lean();
  if (!doc) notFound();

  const defaults: MonthlyEntryInput = {
    year: doc.year,
    month: doc.month as MonthlyEntryInput["month"],
    kere: doc.kere,
    ann: doc.ann,
    note: doc.note ?? "",
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit entry</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {doc.month} {doc.year}
        </p>
      </div>
      <EntryForm defaultValues={defaults} entryId={String(doc._id)} />
    </div>
  );
}
