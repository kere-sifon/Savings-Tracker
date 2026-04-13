export type EntryTableRow = {
  year: number;
  month: string;
  isPlaceholder: boolean;
  isFuture: boolean;
  entry: null | {
    _id: string;
    kere: number;
    ann: number;
    note: string | null;
  };
};

/** Partner contributions for the row (deductions are separate; see page totals). */
export function rowTotalContributions(row: EntryTableRow): number {
  return row.entry ? row.entry.kere + row.entry.ann : 0;
}
