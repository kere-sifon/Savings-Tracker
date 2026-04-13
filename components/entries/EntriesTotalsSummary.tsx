import { formatCAD } from "@/lib/money";
import { cn } from "@/lib/utils";

type Props = {
  totalContributions: number;
  totalDeductions: number;
  /** Current “GIC Return” amount from Account distribution (same bucket as Accounts page). */
  gicReturn: number;
  /** When true, net = contributions + gicReturn − deductions (all-years view). */
  includeGicInNet: boolean;
  /** e.g. "2025" or "all years" */
  scopeLabel: string;
};

export function EntriesTotalsSummary({
  totalContributions,
  totalDeductions,
  gicReturn,
  includeGicInNet,
  scopeLabel,
}: Props) {
  const net = includeGicInNet
    ? totalContributions + gicReturn - totalDeductions
    : totalContributions - totalDeductions;

  return (
    <div
      className="grid gap-4 rounded-lg border border-border bg-card p-4 sm:grid-cols-2 xl:grid-cols-4"
      role="region"
      aria-label={`Totals for ${scopeLabel}`}
    >
      <div>
        <p className="text-xs font-medium text-muted-foreground">
          Total contributions ({scopeLabel})
        </p>
        <p className="mt-1 text-lg font-semibold tabular-nums text-emerald-800 dark:text-emerald-600">
          {formatCAD(totalContributions)}
        </p>
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground">GIC Return</p>
        <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">
          {formatCAD(gicReturn)}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          From Accounts → &quot;GIC Return&quot;.{" "}
          {includeGicInNet
            ? "Included in net savings below."
            : "Included in all-time net on the dashboard; year net is contributions − deductions only."}
        </p>
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground">
          Total deductions ({scopeLabel})
        </p>
        <p className="mt-1 text-lg font-semibold tabular-nums text-red-600">
          {formatCAD(totalDeductions)}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Tracked on the Deductions page — independent of these rows.
        </p>
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground">Net savings</p>
        <p
          className={cn(
            "mt-1 text-lg font-semibold tabular-nums",
            net >= 0 ? "text-emerald-700" : "text-red-600",
          )}
        >
          {formatCAD(net)}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {includeGicInNet
            ? `Contributions + GIC Return − deductions (${scopeLabel}).`
            : `Contributions − deductions for ${scopeLabel} (GIC Return is not attributed to a single year).`}
        </p>
      </div>
    </div>
  );
}
