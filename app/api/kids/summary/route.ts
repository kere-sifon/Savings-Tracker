import { NextResponse } from "next/server";
import { connectKidsDB } from "@/lib/db-kids";
import { computeKidsSummary } from "@/lib/kids/summary";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectKidsDB();
    const summary = await computeKidsSummary();
    return NextResponse.json(summary);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to compute summary" }, { status: 500 });
  }
}
