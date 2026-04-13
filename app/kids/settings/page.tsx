import { connectKidsDB } from "@/lib/db-kids";
import { getOrCreateKidsSettings } from "@/lib/models/kids/KidsSettings";
import { KidsSettingsForm } from "@/components/kids/settings/KidsSettingsForm";

export const dynamic = "force-dynamic";

export default async function KidsSettingsPage() {
  await connectKidsDB();
  const s = await getOrCreateKidsSettings();

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Labels used in the Kids Account module.
        </p>
      </div>
      <KidsSettingsForm
        key={`${s.accountName}-${s.ownerName}-${s.partnerName}-${s.currency}`}
        defaultValues={{
          accountName: s.accountName,
          ownerName: s.ownerName,
          partnerName: s.partnerName,
          currency: s.currency,
        }}
      />
    </div>
  );
}
