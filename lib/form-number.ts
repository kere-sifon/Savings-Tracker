/** Base UI `Input` + plain `register()` often yields NaN; use with `Controller` + these helpers. */

export function numberFieldDisplay(n: unknown): string | number {
  return typeof n === "number" && !Number.isNaN(n) ? n : "";
}

export function parseNumberInput(raw: string): number {
  if (raw === "") return Number.NaN;
  const n = Number(raw);
  return Number.isNaN(n) ? Number.NaN : n;
}
