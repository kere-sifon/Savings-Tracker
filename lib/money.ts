export function formatCAD(n: number): string {
  return n.toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD",
  });
}
