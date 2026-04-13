"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCAD } from "@/lib/money";

type Row = { name: string; total: number };

export function IncomeByCategoryBar({ data }: { data: Row[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground">No income data.</p>;
  }
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 16, right: 16 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis type="number" tickFormatter={(v) => formatCAD(Number(v))} />
          <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => formatCAD(Number(v))} />
          <Bar dataKey="total" fill="hsl(142 76% 36%)" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
