"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { numberFieldDisplay, parseNumberInput } from "@/lib/form-number";

const schema = z
  .object({
    startingBalance: z.coerce.number(),
    partner1Name: z.string().min(1, "Required"),
    partner2Name: z.string().min(1, "Required"),
  })
  .superRefine((data, ctx) => {
    if (!Number.isFinite(data.startingBalance) || Number.isNaN(data.startingBalance)) {
      ctx.addIssue({
        code: "custom",
        message: "Enter starting balance",
        path: ["startingBalance"],
      });
    }
  });

type FormValues = z.infer<typeof schema>;

type Props = {
  defaultValues: FormValues;
};

export function SettingsForm({ defaultValues }: Props) {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues,
  });

  const onSubmit = async (data: FormValues) => {
    const res = await fetch("/api/savings/settings", {
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
        <Label htmlFor="startingBalance">Starting balance (CAD)</Label>
        <Controller
          name="startingBalance"
          control={form.control}
          render={({ field, fieldState }) => (
            <Input
              id="startingBalance"
              type="number"
              step="0.01"
              value={numberFieldDisplay(field.value)}
              onChange={(e) =>
                field.onChange(parseNumberInput(e.target.value))
              }
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
              aria-invalid={fieldState.invalid}
            />
          )}
        />
        {form.formState.errors.startingBalance?.message ? (
          <p className="text-xs text-destructive">
            {form.formState.errors.startingBalance.message}
          </p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="partner1Name">Partner 1 name</Label>
        <Controller
          name="partner1Name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Input
              id="partner1Name"
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
              aria-invalid={fieldState.invalid}
            />
          )}
        />
        {form.formState.errors.partner1Name?.message ? (
          <p className="text-xs text-destructive">
            {form.formState.errors.partner1Name.message}
          </p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="partner2Name">Partner 2 name</Label>
        <Controller
          name="partner2Name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Input
              id="partner2Name"
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
              aria-invalid={fieldState.invalid}
            />
          )}
        />
        {form.formState.errors.partner2Name?.message ? (
          <p className="text-xs text-destructive">
            {form.formState.errors.partner2Name.message}
          </p>
        ) : null}
      </div>
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Saving…" : "Save settings"}
      </Button>
    </form>
  );
}
