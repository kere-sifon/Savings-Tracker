import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { adjustBankBalance } from "@/lib/account-bank";
import { Deduction } from "@/lib/models/savings/Deduction";
import { deductionBodySchema } from "@/lib/schemas/deduction";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    await connectDB();
    const doc = await Deduction.findById(id).lean();
    if (!doc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(doc);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to load deduction" },
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
    const parsed = deductionBodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const b = parsed.data;
    const desc = b.description.trim();
    const before = await Deduction.findById(id).lean();
    if (!before) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const updated = await Deduction.findByIdAndUpdate(
      id,
      {
        year: b.year,
        month: b.month,
        amount: b.amount,
        description: desc || "Deduction",
      },
      { new: true, runValidators: true },
    ).lean();
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    await adjustBankBalance(before.amount - b.amount);
    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to update deduction" },
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
    const res = await Deduction.findByIdAndDelete(id);
    if (!res) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    await adjustBankBalance(res.amount);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to delete deduction" },
      { status: 500 },
    );
  }
}
