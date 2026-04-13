import { MONTHS } from "@/lib/months";
import { MonthlyEntry } from "@/lib/models/savings/MonthlyEntry";
import type { EntryTableRow } from "@/lib/entry-row";
import { sortEntriesForList } from "@/lib/summary";

export async function loadYearRows(year: number, now = new Date()) {
  const docs = await MonthlyEntry.find({ year }).lean();

  const byMonth = new Map(docs.map((d) => [d.month, d]));
  const cy = now.getFullYear();
  const cm = now.getMonth() + 1;

  const rows: EntryTableRow[] = [];
  for (let mi = 12; mi >= 1; mi--) {
    const monthName = MONTHS[mi - 1];
    const e = byMonth.get(monthName);
    const isFuture = year > cy || (year === cy && mi > cm);

    if (e) {
      rows.push({
        year,
        month: monthName,
        isPlaceholder: false,
        isFuture: false,
        entry: {
          _id: String(e._id),
          kere: e.kere,
          ann: e.ann,
          note: e.note ?? null,
        },
      });
    } else {
      rows.push({
        year,
        month: monthName,
        isPlaceholder: true,
        isFuture,
        entry: null,
      });
    }
  }
  return rows;
}

export async function loadAllEntriesPage(page: number, limit: number) {
  const total = await MonthlyEntry.countDocuments();
  const all = await MonthlyEntry.find().lean();
  const sorted = sortEntriesForList(all);
  const start = (page - 1) * limit;
  const slice = sorted.slice(start, start + limit);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const rows: EntryTableRow[] = slice.map((e) => ({
    year: e.year,
    month: e.month,
    isPlaceholder: false,
    isFuture: false,
    entry: {
      _id: String(e._id),
      kere: e.kere,
      ann: e.ann,
      note: e.note ?? null,
    },
  }));

  return { rows, total, totalPages, page };
}
