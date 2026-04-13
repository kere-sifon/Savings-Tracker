"use client";

import { useEffect, useState } from "react";
import { AppSelectorCard } from "@/components/app-selector/AppSelectorCard";

type Summary = { coverageRatio: number };

export function KidsSelectorStat() {
  const [stat, setStat] = useState<string>("—");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/kids/summary");
        if (!res.ok) return;
        const data = (await res.json()) as Summary;
        if (!cancelled && typeof data.coverageRatio === "number") {
          setStat(`${data.coverageRatio.toFixed(1)}%`);
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AppSelectorCard
      href="/kids"
      title="Kids Account"
      description="CCB income, RESP, and child-related expenses with running balance."
      statLabel="Coverage ratio"
      statValue={stat}
    />
  );
}
