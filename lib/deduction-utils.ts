export type DeductionLean = {
  _id: { toString(): string };
  year: number;
  month: string;
  amount: number;
  description: string;
};

export function monthDeductionKey(year: number, month: string): string {
  return `${year}-${month}`;
}

export function groupDeductionsByMonth(
  deds: DeductionLean[],
): Map<
  string,
  { _id: string; amount: number; description: string }[]
> {
  const map = new Map<
    string,
    { _id: string; amount: number; description: string }[]
  >();
  for (const d of deds) {
    const k = monthDeductionKey(d.year, d.month);
    const list = map.get(k) ?? [];
    list.push({
      _id: String(d._id),
      amount: d.amount,
      description: d.description,
    });
    map.set(k, list);
  }
  return map;
}
