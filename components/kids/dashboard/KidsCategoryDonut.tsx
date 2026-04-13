"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCAD } from "@/lib/money";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(199 89% 48%)",
  "hsl(142 76% 36%)",
  "hsl(48 96% 53%)",
  "hsl(280 65% 60%)",
  "hsl(24 95% 53%)",
];

type Row = { category: string; total: number };

export function KidsCategoryDonut({ data }: { data: Row[] }) {
  const expensesOnly = data
    .filter((d) => d.total < 0)
    .map((d) => ({
      name: d.category,
      value: Math.abs(d.total),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Top expense categories</CardTitle>
        <p className="text-sm text-muted-foreground">By absolute spend (top 6)</p>
      </CardHeader>
      <CardContent className="h-[280px] min-w-0 w-full">
        {expensesOnly.length === 0 ? (
          <p className="text-sm text-muted-foreground">No expense data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expensesOnly}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={56}
                outerRadius={88}
                paddingAngle={2}
              >
                {expensesOnly.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatCAD(Number(value ?? 0))}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
