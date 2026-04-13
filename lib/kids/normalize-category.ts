/** RESP / YMCA normalization — run on every write (spec). */
export function normalizeCategoryFromDescription(
  description: string,
  selectedCategory: string,
): string {
  const d = description.toLowerCase();
  if (d.includes("resp")) return "RESP";
  if (d.includes("ymca")) return "YMCA";
  return selectedCategory.trim();
}
