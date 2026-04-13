import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { LineOfCredit } from "@/lib/models/savings/LineOfCredit";

export async function GET() {
  try {
    await connectDB();
    const rows = await LineOfCredit.find().sort({ name: 1 }).lean();
    return NextResponse.json(rows);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to load lines of credit" },
      { status: 500 },
    );
  }
}
