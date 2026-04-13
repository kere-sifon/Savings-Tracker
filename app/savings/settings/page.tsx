import { connectDB } from "@/lib/db";
import { getOrCreateSettings } from "@/lib/models/savings/Settings";
import { SettingsForm } from "@/components/settings/SettingsForm";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function SettingsPage() {
  await connectDB();
  const s = await getOrCreateSettings();

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Starting balance and partner names used across the app.
          </p>
        </div>
        <a
          href="/api/savings/export"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "shrink-0 whitespace-nowrap",
          )}
          download
        >
          Export to Excel
        </a>
      </div>
      <p className="text-sm text-muted-foreground">
        Download an{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs">.xlsx</code> file
        with monthly entries, deductions, accounts, lines of credit, and settings.
      </p>
      <SettingsForm
        key={`${s.startingBalance}-${s.partner1Name}-${s.partner2Name}`}
        defaultValues={{
          startingBalance: s.startingBalance,
          partner1Name: s.partner1Name,
          partner2Name: s.partner2Name,
        }}
      />
    </div>
  );
}
