"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from "@/lib/schemas/kids-transaction";
import { numberFieldDisplay, parseNumberInput } from "@/lib/form-number";

const schema = z.object({
  date: z.string().optional(),
  description: z.string().min(1, "Required"),
  category: z.string().min(1),
  type: z.enum(["INCOME", "EXPENSE"]),
  amount: z.coerce.number().finite().positive("Enter a positive amount"),
  tags: z.string().optional(),
  isCarryForward: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  transactionId?: string;
  defaultValues?: Partial<FormValues>;
};

export function TransactionForm({ transactionId, defaultValues }: Props) {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      date: defaultValues?.date ?? "",
      description: defaultValues?.description ?? "",
      category: defaultValues?.category ?? INCOME_CATEGORIES[0],
      type: defaultValues?.type ?? "INCOME",
      amount: defaultValues?.amount ?? 0,
      tags: defaultValues?.tags ?? "",
      isCarryForward: defaultValues?.isCarryForward ?? false,
    },
  });

  const type = form.watch("type");
  const categories =
    type === "INCOME" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const onSubmit = async (data: FormValues) => {
    const tags = data.tags
      ? data.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];
    const payload = {
      date: data.date || null,
      description: data.description,
      category: data.category,
      type: data.type,
      amount: data.amount,
      tags,
      isCarryForward: data.isCarryForward,
    };

    const url = transactionId
      ? `/api/kids/transactions/${transactionId}`
      : "/api/kids/transactions";
    const method = transactionId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      alert("Save failed");
      return;
    }
    router.push("/kids/transactions");
    router.refresh();
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="mx-auto max-w-lg space-y-4 rounded-lg border border-border bg-card p-6 shadow-sm"
    >
      <div className="space-y-2">
        <Label htmlFor="date">Date (optional)</Label>
        <Input id="date" type="date" {...form.register("date")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input id="description" {...form.register("description")} />
        {form.formState.errors.description?.message ? (
          <p className="text-xs text-destructive">
            {form.formState.errors.description.message}
          </p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label>Type</Label>
        <Controller
          name="type"
          control={form.control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(v) => {
                field.onChange(v);
                const next =
                  v === "INCOME" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0];
                form.setValue("category", next);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INCOME">Income</SelectItem>
                <SelectItem value="EXPENSE">Expense</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className="space-y-2">
        <Label>Category</Label>
        <Controller
          name="category"
          control={form.control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="amount">Amount (CAD, positive)</Label>
        <Controller
          name="amount"
          control={form.control}
          render={({ field, fieldState }) => (
            <Input
              id="amount"
              type="number"
              step="0.01"
              min={0}
              value={numberFieldDisplay(field.value)}
              onChange={(e) => field.onChange(parseNumberInput(e.target.value))}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
              aria-invalid={fieldState.invalid}
            />
          )}
        />
        {form.formState.errors.amount?.message ? (
          <p className="text-xs text-destructive">
            {form.formState.errors.amount.message}
          </p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          placeholder="e.g. CCB, RESP"
          {...form.register("tags")}
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          id="cf"
          type="checkbox"
          className="h-4 w-4 rounded border border-input"
          {...form.register("isCarryForward")}
        />
        <Label htmlFor="cf" className="font-normal">
          Carry-forward / opening balance row
        </Label>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving…" : "Save"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/kids/transactions")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
