import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { adjustBankBalance } from "@/lib/account-bank";
import { Deduction } from "@/lib/models/savings/Deduction";
import { deductionBodySchema } from "@/lib/schemas/deduction";
import { compareYearMonth } from "@/lib/months";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get("year");
    const monthParam = searchParams.get("month");

    const filter: { year?: number; month?: string } = {};
    if (yearParam !== null && yearParam !== "") {
      const y = parseInt(yearParam, 10);
      if (!Number.isNaN(y)) filter.year = y;
    }
    if (monthParam !== null && monthParam !== "") {
      filter.month = monthParam;
    }

    const rows = await Deduction.find(filter).lean();
    rows.sort((a, b) => -compareYearMonth(a, b));
    return NextResponse.json(rows);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to load deductions" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const json = await request.json();
    const parsed = deductionBodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const b = parsed.data;
    const desc = b.description.trim();
    const created = await Deduction.create({
      year: b.year,
      month: b.month,
      amount: b.amount,
      description: desc || "Deduction",
    });
    await adjustBankBalance(-b.amount);
    return NextResponse.json(created.toObject(), { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create deduction" },
      { status: 500 },
    );
  }
}
