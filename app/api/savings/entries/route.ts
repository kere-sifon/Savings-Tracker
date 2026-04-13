import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { adjustBankBalance } from "@/lib/account-bank";
import { MonthlyEntry } from "@/lib/models/savings/MonthlyEntry";
import { monthlyEntryInputSchema } from "@/lib/schemas/entry";
import { sortEntriesForList } from "@/lib/summary";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get("year");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));

    const filter: { year?: number } = {};
    if (yearParam !== null && yearParam !== "" && yearParam !== "all") {
      const y = parseInt(yearParam, 10);
      if (!Number.isNaN(y)) filter.year = y;
    }

    const total = await MonthlyEntry.countDocuments(filter);
    const years = (await MonthlyEntry.distinct("year")).sort((a, b) => b - a);
    const all = await MonthlyEntry.find(filter).lean();
    const sorted = sortEntriesForList(all);
    const start = (page - 1) * limit;
    const slice = sorted.slice(start, start + limit);
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return NextResponse.json({
      data: slice,
      meta: { page, limit, total, totalPages, years },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to load entries" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const json = await request.json();
    const parsed = monthlyEntryInputSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const body = parsed.data;
    try {
      const created = await MonthlyEntry.create({
        year: body.year,
        month: body.month,
        kere: body.kere,
        ann: body.ann,
        note: body.note ?? null,
      });
      await adjustBankBalance(body.kere + body.ann);
      return NextResponse.json(created.toObject(), { status: 201 });
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "code" in err &&
        (err as { code?: number }).code === 11000
      ) {
        return NextResponse.json(
          { error: "An entry for this year and month already exists" },
          { status: 409 },
        );
      }
      throw err;
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create entry" },
      { status: 500 },
    );
  }
}
