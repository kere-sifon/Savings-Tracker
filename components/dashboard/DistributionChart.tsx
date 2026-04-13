"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCAD } from "@/lib/money";

export type AccountSlice = {
  _id: string;
  label: string;
  amount: number;
};

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
];

type Props = {
  accounts: AccountSlice[];
};

export function DistributionChart({ accounts }: Props) {
  const data = accounts.map((a) => ({
    name: a.label,
    value: a.amount,
  }));

  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Account distribution</CardTitle>
        <p className="text-sm text-muted-foreground">
          How savings are allocated across accounts. The Bank slice changes when you record monthly
          entries (increase) or deductions (decrease).
        </p>
      </CardHeader>
      <CardContent className="h-[320px] min-h-[280px] min-w-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={56}
              outerRadius={100}
              paddingAngle={2}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [
                formatCAD(Number(value ?? 0)),
                String(name ?? ""),
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
