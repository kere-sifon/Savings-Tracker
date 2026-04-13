"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  monthlyEntryInputSchema,
  type MonthlyEntryInput,
} from "@/lib/schemas/entry";
import { MONTHS } from "@/lib/months";
import { numberFieldDisplay, parseNumberInput } from "@/lib/form-number";
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
import Link from "next/link";

type Props = {
  defaultValues: MonthlyEntryInput;
  entryId?: string;
};

export function EntryForm({ defaultValues, entryId }: Props) {
  const router = useRouter();
  const form = useForm<MonthlyEntryInput>({
    resolver: zodResolver(
      monthlyEntryInputSchema,
    ) as Resolver<MonthlyEntryInput>,
    defaultValues,
  });

  const onSubmit = async (data: MonthlyEntryInput) => {
    const payload = {
      ...data,
      note: data.note?.trim() ? data.note.trim() : null,
    };

    const url = entryId
      ? `/api/savings/entries/${entryId}`
      : "/api/savings/entries";
    const method = entryId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error(err);
      alert(err?.error ? JSON.stringify(err.error) : "Save failed");
      return;
    }

    router.push("/savings/entries");
    router.refresh();
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="mx-auto max-w-2xl space-y-6"
    >
      <p className="text-sm text-muted-foreground">
        Deductions are managed separately on the{" "}
        <Link
          href="/savings/deductions"
          className="font-medium text-primary underline"
        >
          Deductions
        </Link>{" "}
        page.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="year">Year</Label>
          <Controller
            name="year"
            control={form.control}
            render={({ field, fieldState }) => (
              <Input
                id="year"
                type="number"
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
          {form.formState.errors.year && (
            <p className="mt-1 text-xs text-destructive">
              {String(form.formState.errors.year.message)}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="entry-month">Month</Label>
          <Controller
            name="month"
            control={form.control}
            render={({ field, fieldState }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="entry-month" aria-invalid={fieldState.invalid}>
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {form.formState.errors.month && (
            <p className="mt-1 text-xs text-destructive">
              {String(form.formState.errors.month.message)}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="kere">Kere ($)</Label>
          <Controller
            name="kere"
            control={form.control}
            render={({ field, fieldState }) => (
              <Input
                id="kere"
                type="number"
                step="0.01"
                min={0}
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
          {form.formState.errors.kere && (
            <p className="mt-1 text-xs text-destructive">
              {String(form.formState.errors.kere.message)}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="ann">Ann ($)</Label>
          <Controller
            name="ann"
            control={form.control}
            render={({ field, fieldState }) => (
              <Input
                id="ann"
                type="number"
                step="0.01"
                min={0}
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
          {form.formState.errors.ann && (
            <p className="mt-1 text-xs text-destructive">
              {String(form.formState.errors.ann.message)}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="note">Note (optional)</Label>
        <Controller
          name="note"
          control={form.control}
          render={({ field }) => (
            <Input
              id="note"
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
            />
          )}
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving…" : "Save"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/savings/entries")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
