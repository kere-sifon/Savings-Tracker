import { EntryForm } from "@/components/entries/EntryForm";
import { MONTHS } from "@/lib/months";
import type { MonthlyEntryInput } from "@/lib/schemas/entry";

export default function NewEntryPage() {
  const now = new Date();
  const defaults: MonthlyEntryInput = {
    year: now.getFullYear(),
    month: MONTHS[now.getMonth()],
    kere: 0,
    ann: 0,
    note: "",
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">New monthly entry</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Record partner contributions and optional notes. Manage deductions on
          the Deductions page.
        </p>
      </div>
      <EntryForm defaultValues={defaults} />
    </div>
  );
}
