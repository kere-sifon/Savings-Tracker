import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { computeSummary } from "@/lib/summary";

export async function GET() {
  try {
    await connectDB();
    const summary = await computeSummary();
    return NextResponse.json(summary);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to compute summary" },
      { status: 500 },
    );
  }
}
