"use client";

import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  accountName: z.string().min(1),
  ownerName: z.string(),
  partnerName: z.string(),
  currency: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  defaultValues: FormValues;
};

export function KidsSettingsForm({ defaultValues }: Props) {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues,
  });

  const onSubmit = async (data: FormValues) => {
    const res = await fetch("/api/kids/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      alert("Save failed");
      return;
    }
    router.refresh();
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4 rounded-lg border border-border bg-card p-6 shadow-sm"
    >
      <div className="space-y-2">
        <Label htmlFor="accountName">Account name</Label>
        <Input id="accountName" {...form.register("accountName")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ownerName">Owner name</Label>
        <Input id="ownerName" {...form.register("ownerName")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="partnerName">Partner name</Label>
        <Input id="partnerName" {...form.register("partnerName")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="currency">Currency</Label>
        <Input id="currency" {...form.register("currency")} />
      </div>
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Saving…" : "Save"}
      </Button>
    </form>
  );
}
