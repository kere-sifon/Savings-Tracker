"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCAD } from "@/lib/money";

type Point = { ym: string; runningBalance: number };

export function KidsRunningBalanceChart({ data }: { data: Point[] }) {
  const chartData = data.map((d) => ({
    ...d,
    label: d.ym,
  }));

  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Running balance</CardTitle>
        <p className="text-sm text-muted-foreground">
          Cumulative net by month (all transactions, carry-forwards included).
        </p>
      </CardHeader>
      <CardContent className="h-[320px] min-h-[280px] min-w-0 w-full pl-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11 }}
              interval="preserveStartEnd"
              minTickGap={24}
            />
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
              formatter={(value) => [formatCAD(Number(value ?? 0)), "Balance"]}
            />
            <Line
              type="monotone"
              dataKey="runningBalance"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
