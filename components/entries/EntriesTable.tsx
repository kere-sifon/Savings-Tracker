"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCAD } from "@/lib/money";
import { rowTotalContributions, type EntryTableRow } from "@/lib/entry-row";
import { cn } from "@/lib/utils";

function isGicMaturityNote(note: string | null | undefined): boolean {
  if (!note) return false;
  return note.toLowerCase().includes("gic maturity");
}

type Props = {
  rows: EntryTableRow[];
  pagination: { page: number; totalPages: number; total: number } | null;
};

export function EntriesTable({ rows, pagination }: Props) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const res = await fetch(`/api/savings/entries/${deleteId}`, {
      method: "DELETE",
    });
    setDeleting(false);
    if (!res.ok) {
      alert("Delete failed");
      return;
    }
    setDeleteId(null);
    router.refresh();
  };

  return (
    <>
      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Year</TableHead>
              <TableHead>Month</TableHead>
              <TableHead className="text-right">Kere</TableHead>
              <TableHead className="text-right">Ann</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Note</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const rowKey = `${row.year}-${row.month}`;
              const totalContrib = rowTotalContributions(row);
              const muted = row.isPlaceholder || row.isFuture;

              return (
                <TableRow
                  key={rowKey}
                  className={cn(muted && "bg-muted/40 text-muted-foreground")}
                >
                  <TableCell>{row.year}</TableCell>
                  <TableCell className="font-medium">{row.month}</TableCell>
                  <TableCell
                    className={cn(
                      "text-right tabular-nums",
                      row.entry && "text-emerald-700",
                    )}
                  >
                    {row.entry ? formatCAD(row.entry.kere) : "—"}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right tabular-nums",
                      row.entry && "text-emerald-700",
                    )}
                  >
                    {row.entry ? formatCAD(row.entry.ann) : "—"}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right tabular-nums font-medium",
                      row.entry && "text-emerald-800",
                    )}
                  >
                    {row.entry ? formatCAD(totalContrib) : "—"}
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    {row.entry?.note ? (
                      <span className="flex flex-wrap items-center gap-2">
                        {isGicMaturityNote(row.entry.note) ? (
                          <Badge className="bg-amber-500 text-amber-950 hover:bg-amber-500">
                            {row.entry.note}
                          </Badge>
                        ) : (
                          <span>{row.entry.note}</span>
                        )}
                      </span>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {row.entry ? (
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/savings/entries/${row.entry._id}/edit`}
                          aria-label="Edit entry"
                          className={cn(
                            buttonVariants({ variant: "ghost", size: "icon" }),
                            "h-8 w-8",
                          )}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => setDeleteId(row.entry!._id)}
                          aria-label="Delete entry"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {pagination && pagination.totalPages > 1 ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
          <span>
            Page {pagination.page} of {pagination.totalPages} ({pagination.total}{" "}
            entries)
          </span>
          <div className="flex gap-2">
            {pagination.page > 1 ? (
              <Link
                href={`/savings/entries?view=all&page=${pagination.page - 1}`}
                prefetch={false}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Previous
              </Link>
            ) : (
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
            )}
            {pagination.page < pagination.totalPages ? (
              <Link
                href={`/savings/entries?view=all&page=${pagination.page + 1}`}
                prefetch={false}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Next
              </Link>
            ) : (
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            )}
          </div>
        </div>
      ) : null}

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete entry?</DialogTitle>
            <DialogDescription>
              This removes the monthly contribution record only. Deductions are managed
              separately on the Deductions page and are not deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" disabled={deleting} onClick={handleDelete}>
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
