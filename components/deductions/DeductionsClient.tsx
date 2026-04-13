"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import {
  deductionBodySchema,
  type DeductionBody,
} from "@/lib/schemas/deduction";
import { MONTHS } from "@/lib/months";
import { formatCAD } from "@/lib/money";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { numberFieldDisplay, parseNumberInput } from "@/lib/form-number";

export type DeductionRow = {
  id: string;
  year: number;
  month: string;
  amount: number;
  description: string;
};

type Props = {
  initial: DeductionRow[];
  prefillYear?: string;
  prefillMonth?: string;
  editId?: string;
};

export function DeductionsClient({
  initial,
  prefillYear,
  prefillMonth,
  editId,
}: Props) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  /** Keeps the id for PUT even if React state is batched with dialog lifecycle */
  const savingIdRef = useRef<string | null>(null);
  const openedForEditId = useRef<string | null>(null);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");

  const buildAddDraft = (): DeductionBody => {
    const y = prefillYear ? parseInt(prefillYear, 10) : new Date().getFullYear();
    const m =
      prefillMonth && MONTHS.some((x) => x === prefillMonth)
        ? (prefillMonth as DeductionBody["month"])
        : (MONTHS[new Date().getMonth()] as DeductionBody["month"]);
    return {
      year: Number.isNaN(y) ? new Date().getFullYear() : y,
      month: m,
      amount: 0,
      description: "",
    };
  };

  /** Remount dialog body so Base UI Select + inputs pick up `reset()` values (do not use RHF `values` — it resets user input on re-render). */
  const [dialogKey, setDialogKey] = useState(0);

  const form = useForm<DeductionBody>({
    resolver: zodResolver(deductionBodySchema) as Resolver<DeductionBody>,
    defaultValues: buildAddDraft(),
  });

  const rowToFormValues = (row: DeductionRow): DeductionBody => {
    const raw = String(row.month ?? "").trim();
    const month =
      (MONTHS.find((m) => m === raw) ??
        MONTHS.find((m) => m.toLowerCase() === raw.toLowerCase()) ??
        MONTHS[0]) as DeductionBody["month"];
    return {
      year: row.year,
      month,
      amount: row.amount,
      description: row.description ?? "",
    };
  };

  useEffect(() => {
    if (!editId) {
      openedForEditId.current = null;
      return;
    }
    if (openedForEditId.current === editId) return;
    const row = initial.find((r) => r.id === editId);
    if (!row) return;
    openedForEditId.current = editId;
    savingIdRef.current = row.id;
    setDialogMode("edit");
    form.reset(rowToFormValues(row));
    setDialogKey((k) => k + 1);
    setDialogOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run when URL or data for edit changes
  }, [editId, initial]);

  const openNew = () => {
    savingIdRef.current = null;
    setDialogMode("add");
    form.reset(buildAddDraft());
    setDialogKey((k) => k + 1);
    setDialogOpen(true);
  };

  const openEdit = (row: DeductionRow) => {
    savingIdRef.current = row.id;
    setDialogMode("edit");
    form.reset(rowToFormValues(row));
    setDialogKey((k) => k + 1);
    setDialogOpen(true);
  };

  const onSubmit = async (data: DeductionBody) => {
    const id = savingIdRef.current;
    const payload = {
      ...data,
      description: data.description.trim(),
    };
    const url = id
      ? `/api/savings/deductions/${id}`
      : "/api/savings/deductions";
    const method = id ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const e = err?.error;
        const msg =
          typeof e === "string"
            ? e
            : e?.formErrors?.length
              ? e.formErrors.join(", ")
              : e?.fieldErrors
                ? Object.entries(e.fieldErrors)
                    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
                    .join("; ")
                : "Save failed";
        alert(msg);
        return;
      }
      savingIdRef.current = null;
      setDialogOpen(false);
      router.replace("/savings/deductions");
      router.refresh();
    } catch (e) {
      console.error(e);
      alert(
        e instanceof Error ? e.message : "Network error — could not save deduction.",
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const res = await fetch(`/api/savings/deductions/${deleteId}`, {
      method: "DELETE",
    });
    setDeleting(false);
    if (!res.ok) {
      alert("Delete failed");
      return;
    }
    setDeleteId(null);
    router.replace("/savings/deductions");
    router.refresh();
  };

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Each deduction is its own record. They roll into monthly totals and the
          dashboard summary.
        </p>
        <Button type="button" onClick={openNew}>
          Add deduction
        </Button>
      </div>

      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Year</TableHead>
              <TableHead>Month</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initial.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No deductions yet.
                </TableCell>
              </TableRow>
            ) : (
              initial.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.year}</TableCell>
                  <TableCell>{r.month}</TableCell>
                  <TableCell className="text-right font-medium text-red-600 tabular-nums">
                    {formatCAD(r.amount)}
                  </TableCell>
                  <TableCell>{r.description}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(r)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => setDeleteId(r.id)}
                      aria-label="Delete deduction"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={(o) => {
          setDialogOpen(o);
          if (!o) {
            savingIdRef.current = null;
            openedForEditId.current = null;
            if (editId) router.replace("/savings/deductions");
          }
        }}
      >
        <DialogContent key={dialogKey}>
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "edit" ? "Edit deduction" : "Add deduction"}
            </DialogTitle>
            <DialogDescription>
              Link this amount to a calendar month. It affects net savings for that
              month.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="d-year">Year</Label>
                <Controller
                  name="year"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Input
                      id="d-year"
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
                {form.formState.errors.year?.message ? (
                  <p className="mt-1 text-sm text-destructive">
                    {form.formState.errors.year.message}
                  </p>
                ) : null}
              </div>
              <div>
                <Label htmlFor="d-month">Month</Label>
                <Controller
                  name="month"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <div>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="d-month"
                          aria-invalid={fieldState.invalid}
                        >
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {MONTHS.map((m) => (
                            <SelectItem key={m} value={m}>
                              {m}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.error?.message ? (
                        <p className="mt-1 text-sm text-destructive">
                          {fieldState.error.message}
                        </p>
                      ) : null}
                    </div>
                  )}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="d-amt">Amount (CAD)</Label>
              <Controller
                name="amount"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Input
                    id="d-amt"
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
              {form.formState.errors.amount?.message ? (
                <p className="mt-1 text-sm text-destructive">
                  {form.formState.errors.amount.message}
                </p>
              ) : null}
            </div>
            <div>
              <Label htmlFor="d-desc">Description (optional)</Label>
              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Input
                    id="d-desc"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    aria-invalid={fieldState.invalid}
                  />
                )}
              />
              {form.formState.errors.description?.message ? (
                <p className="mt-1 text-sm text-destructive">
                  {form.formState.errors.description.message}
                </p>
              ) : null}
              <p className="mt-1 text-xs text-muted-foreground">
                If left blank, it is saved as &quot;Deduction&quot;.
              </p>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving…" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete deduction?</DialogTitle>
            <DialogDescription>This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleting}
              onClick={handleDelete}
            >
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
