"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCAD } from "@/lib/money";

type Account = {
  id: string;
  label: string;
  amount: number;
  updatedAt: string;
};

type Props = {
  accounts: Account[];
};

export function AccountsClient({ accounts: initial }: Props) {
  const router = useRouter();
  const [accounts, setAccounts] = useState(initial);
  const [savingId, setSavingId] = useState<string | null>(null);

  const total = useMemo(
    () => accounts.reduce((s, a) => s + a.amount, 0),
    [accounts],
  );

  const bankAndFshaTotal = useMemo(() => {
    const labels = new Set(["Bank", "FSHA"]);
    return accounts
      .filter((a) => labels.has(a.label))
      .reduce((s, a) => s + a.amount, 0);
  }, [accounts]);

  const save = async (id: string, amount: number) => {
    setSavingId(id);
    const res = await fetch(`/api/savings/accounts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    setSavingId(null);
    if (!res.ok) {
      alert("Save failed");
      return;
    }
    const updated = await res.json();
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              amount: updated.amount,
              updatedAt: new Date(updated.updatedAt).toISOString(),
            }
          : a,
      ),
    );
    router.refresh();
  };

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {accounts.map((a) => (
          <AccountCard
            key={a.id}
            account={a}
            onSave={(amt) => save(a.id, amt)}
            saving={savingId === a.id}
          />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-border/80 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-lg">Bank + FSHA</CardTitle>
            <p className="text-xs font-normal text-muted-foreground">
              Combined balance for liquid / accessible buckets (excludes GIC and GIC Return).
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums text-foreground">
              {formatCAD(bankAndFshaTotal)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Total across accounts</CardTitle>
            <p className="text-xs font-normal text-muted-foreground">
              Sum of all distribution buckets (GIC, FSHA, Bank, GIC Return).
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums text-primary">
              {formatCAD(total)}
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function AccountCard({
  account,
  onSave,
  saving,
}: {
  account: Account;
  onSave: (amount: number) => void;
  saving: boolean;
}) {
  const [value, setValue] = useState(String(account.amount));

  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">{account.label}</CardTitle>
        {account.label === "Bank" ? (
          <p className="text-xs text-muted-foreground">
            Auto-adjusted when you add or edit monthly contributions (increase) or deductions
            (decrease). You can still correct the balance here if needed.
          </p>
        ) : null}
        <p className="text-xs text-muted-foreground">
          Last updated:{" "}
          {new Date(account.updatedAt).toLocaleString("en-CA", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        <Label htmlFor={`amt-${account.id}`}>Balance (CAD)</Label>
        <Input
          id={`amt-${account.id}`}
          type="number"
          step="0.01"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </CardContent>
      <CardFooter>
        <Button
          type="button"
          disabled={saving}
          onClick={() => onSave(parseFloat(value) || 0)}
        >
          {saving ? "Saving…" : "Save"}
        </Button>
      </CardFooter>
    </Card>
  );
}
