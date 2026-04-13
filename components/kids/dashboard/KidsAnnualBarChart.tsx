"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCAD } from "@/lib/money";

type Row = { year: number; income: number; expenses: number };

export function KidsAnnualBarChart({ data }: { data: Row[] }) {
  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Annual income vs expenses</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] min-w-0 w-full pl-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis
              tick={{ fontSize: 11 }}
              tickFormatter={(v) =>
                new Intl.NumberFormat("en-CA", {
                  notation: "compact",
                  maximumFractionDigits: 1,
                }).format(Number(v))
              }
            />
            <Tooltip
              formatter={(value) => formatCAD(Number(value ?? 0))}
            />
            <Legend />
            <Bar dataKey="income" name="Income" fill="hsl(142 76% 36%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" name="Expenses" fill="hsl(0 84% 60%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
