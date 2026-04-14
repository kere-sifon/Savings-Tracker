import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { adjustBankBalance } from "@/lib/account-bank";
import { MonthlyEntry } from "@/lib/models/savings/MonthlyEntry";
import { monthlyEntryInputSchema } from "@/lib/schemas/entry";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    await connectDB();
    const doc = await MonthlyEntry.findById(id).lean();
    if (!doc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(doc);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to load entry" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
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

    const existing = await MonthlyEntry.findById(id).lean();
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    try {
      const updated = await MonthlyEntry.findByIdAndUpdate(
        id,
        {
          year: body.year,
          month: body.month,
          kere: body.kere,
          ann: body.ann,
          note: body.note ?? null,
        },
        { new: true, runValidators: true },
      ).lean();
      if (!updated) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }

      const prevSum = existing.kere + existing.ann;
      const nextSum = body.kere + body.ann;
      await adjustBankBalance(nextSum - prevSum);

      return NextResponse.json(updated);
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
      { error: "Failed to update entry" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    await connectDB();
    const doc = await MonthlyEntry.findByIdAndDelete(id);
    if (!doc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    await adjustBankBalance(-(doc.kere + doc.ann));
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to delete entry" },
      { status: 500 },
    );
  }
}
