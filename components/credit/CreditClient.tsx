"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCAD } from "@/lib/money";

type Line = {
  id: string;
  name: string;
  balance: number;
  updatedAt: string;
};

type Props = {
  lines: Line[];
  /** Sum of account distribution amounts (same as “Total across accounts” on Accounts). */
  accountsTotal: number;
};

export function CreditClient({
  lines: initial,
  accountsTotal,
}: Props) {
  const router = useRouter();
  const [lines, setLines] = useState(initial);

  const totalAvailable = useMemo(
    () =>
      accountsTotal +
      lines.reduce((s, l) => s + l.balance, 0),
    [accountsTotal, lines],
  );

  const saveLine = async (id: string, balance: number) => {
    const res = await fetch(`/api/savings/credit/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ balance }),
    });
    if (!res.ok) {
      alert("Save failed");
      return;
    }
    const updated = await res.json();
    setLines((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              balance: updated.balance,
              updatedAt: new Date(updated.updatedAt).toISOString(),
            }
          : l,
      ),
    );
    router.refresh();
  };

  return (
    <>
      <Card className="border-primary/30 bg-primary/5 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Total available funding</CardTitle>
          <p className="text-xs text-muted-foreground">
            Total across accounts ({formatCAD(accountsTotal)}) + all lines of credit.
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold tabular-nums text-primary">
            {formatCAD(totalAvailable)}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {lines.map((line) => (
          <LocLineCard key={line.id} line={line} onSave={saveLine} />
        ))}
      </div>
    </>
  );
}

function LocLineCard({
  line,
  onSave,
}: {
  line: Line;
  onSave: (id: string, balance: number) => void;
}) {
  const [value, setValue] = useState(String(line.balance));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValue(String(line.balance));
  }, [line.balance, line.updatedAt]);

  const handleSave = async () => {
    setSaving(true);
    await onSave(line.id, parseFloat(value) || 0);
    setSaving(false);
  };

  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">{line.name}</CardTitle>
        <p className="text-xs text-muted-foreground">
          Last updated:{" "}
          {new Date(line.updatedAt).toLocaleString("en-CA", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`loc-${line.id}`}>Balance (CAD)</Label>
          <Input
            id={`loc-${line.id}`}
            type="number"
            step="0.01"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <Button type="button" disabled={saving} onClick={handleSave}>
          {saving ? "Saving…" : "Save"}
        </Button>
      </CardContent>
    </Card>
  );
}
