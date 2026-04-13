"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  years: number[];
  selectedYear: number;
  mode: "year" | "all";
};

export function EntriesToolbar({ years, selectedYear, mode }: Props) {
  const router = useRouter();
  const selectValue = mode === "all" ? "all" : String(selectedYear);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">Year</span>
        <Select
          value={selectValue}
          onValueChange={(v) => {
            if (v === "all") {
              router.push("/savings/entries?view=all&page=1");
            } else {
              router.push(`/savings/entries?year=${v}`);
            }
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All years (paginated)</SelectItem>
            {years.map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Link
        href="/savings/entries/new"
        className={cn(
          buttonVariants(),
          "inline-flex items-center justify-center gap-2",
        )}
      >
        <Plus className="h-4 w-4" />
        Add entry
      </Link>
    </div>
  );
}
