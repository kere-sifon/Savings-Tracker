import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { AccountDistribution } from "@/lib/models/savings/AccountDistribution";

export async function GET() {
  try {
    await connectDB();
    const rows = await AccountDistribution.find().sort({ label: 1 }).lean();
    return NextResponse.json(rows);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to load accounts" },
      { status: 500 },
    );
  }
}
