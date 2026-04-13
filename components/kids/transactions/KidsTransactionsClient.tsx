"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { formatCAD } from "@/lib/money";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from "@/lib/schemas/kids-transaction";

export type TxRow = {
  _id: string;
  date: string | null;
  description: string;
  category: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  isCarryForward: boolean;
  tags: string[];
};

type Props = {
  rows: TxRow[];
  years: number[];
};

export function KidsTransactionsClient({ rows, years }: Props) {
  const router = useRouter();
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (typeFilter !== "all" && r.type !== typeFilter) return false;
      if (categoryFilter !== "all" && r.category !== categoryFilter) return false;
      if (yearFilter !== "all") {
        const y = parseInt(yearFilter, 10);
        const ry = r.date ? new Date(r.date).getFullYear() : 2023;
        if (ry !== y) return false;
      }
      if (ql) {
        const hit =
          r.description.toLowerCase().includes(ql) ||
          r.category.toLowerCase().includes(ql);
        if (!hit) return false;
      }
      return true;
    });
  }, [rows, typeFilter, categoryFilter, yearFilter, q]);

  const allCategories = useMemo(() => {
    const s = new Set<string>();
    rows.forEach((r) => s.add(r.category));
    return Array.from(s).sort();
  }, [rows]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this transaction?")) return;
    const res = await fetch(`/api/kids/transactions/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Delete failed");
      return;
    }
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">Type</span>
          <Select
            value={typeFilter}
            onValueChange={(v) => setTypeFilter(v ?? "all")}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">Category</span>
          <Select
            value={categoryFilter}
            onValueChange={(v) => setCategoryFilter(v ?? "all")}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {Array.from(
                new Set([
                  ...INCOME_CATEGORIES,
                  ...EXPENSE_CATEGORIES,
                  ...allCategories,
                ]),
              ).map(
                (c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">Year</span>
          <Select
            value={yearFilter}
            onValueChange={(v) => setYearFilter(v ?? "all")}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="min-w-[200px] flex-1 space-y-1">
          <span className="text-xs text-muted-foreground">Search</span>
          <Input
            placeholder="Description or category"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="w-[100px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-muted-foreground">
                  No transactions match.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((r) => (
                <TableRow key={r._id}>
                  <TableCell className="whitespace-nowrap text-sm">
                    {r.date
                      ? new Date(r.date).toLocaleDateString("en-CA")
                      : "—"}
                  </TableCell>
                  <TableCell>{r.description}</TableCell>
                  <TableCell>{r.category}</TableCell>
                  <TableCell>
                    <Badge
                      variant={r.type === "INCOME" ? "default" : "destructive"}
                    >
                      {r.type}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium tabular-nums ${
                      r.amount >= 0 ? "text-emerald-700" : "text-red-600"
                    }`}
                  >
                    {formatCAD(r.amount)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                    {r.tags?.join(", ") || "—"}
                    {r.isCarryForward ? (
                      <Badge variant="secondary" className="ml-2">
                        carry-fwd
                      </Badge>
                    ) : null}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Link
                        href={`/kids/transactions/${r._id}/edit`}
                        className={buttonVariants({ variant: "ghost", size: "sm" })}
                      >
                        Edit
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        aria-label="Delete"
                        onClick={() => handleDelete(r._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
