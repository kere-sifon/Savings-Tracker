import { Suspense } from "react";
import { connectSavingsDB } from "@/lib/db-savings";
import { computeSummary } from "@/lib/summary";
import { formatCAD } from "@/lib/money";
import { AppSelectorCard } from "@/components/app-selector/AppSelectorCard";
import { KidsSelectorStat } from "@/components/app-selector/KidsSelectorStat";
import { SignOutButton } from "@/components/auth/sign-out-button";

export const dynamic = "force-dynamic";

async function SavingsSelectorCard() {
  await connectSavingsDB();
  const summary = await computeSummary();
  return (
    <AppSelectorCard
      href="/savings"
      title="Savings Tracker"
      description="Monthly savings, account distributions, and lines of credit."
      statLabel="Net balance"
      statValue={formatCAD(summary.netBalance)}
    />
  );
}

export default function HomePage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-4 py-12">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Household Finance Hub
          </h1>
          <p className="mt-2 text-muted-foreground">
            Choose a module to continue.
          </p>
        </div>
        <SignOutButton className="self-center sm:mt-1" variant="outline" />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Suspense
          fallback={
            <AppSelectorCard
              href="/savings"
              title="Savings Tracker"
              description="Monthly savings, account distributions, and lines of credit."
              statLabel="Net balance"
              statValue="…"
            />
          }
        >
          <SavingsSelectorCard />
        </Suspense>
        <KidsSelectorStat />
      </div>
    </div>
  );
}
