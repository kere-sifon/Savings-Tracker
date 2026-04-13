import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectKidsDB } from "@/lib/db-kids";
import { Transaction } from "@/lib/models/kids/Transaction";
import { transactionBodySchema } from "@/lib/schemas/kids-transaction";
import { normalizeCategoryFromDescription } from "@/lib/kids/normalize-category";

export const dynamic = "force-dynamic";

function coerceAmount(type: "INCOME" | "EXPENSE", amount: number): number {
  if (type === "INCOME") return Math.abs(amount);
  return -Math.abs(amount);
}

function parseDateInput(v: string | null | undefined): Date | null {
  if (v == null || v === "") return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectKidsDB();
    if (!mongoose.isValidObjectId(params.id)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const doc = await Transaction.findById(params.id).lean();
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(doc);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load transaction" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectKidsDB();
    if (!mongoose.isValidObjectId(params.id)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const json = await req.json();
    const parsed = transactionBodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const data = parsed.data;
    const category = normalizeCategoryFromDescription(
      data.description,
      data.category,
    );
    const amount = coerceAmount(data.type, data.amount);
    const date =
      data.date === undefined
        ? null
        : parseDateInput(data.date === null ? null : data.date);

    const doc = await Transaction.findByIdAndUpdate(
      params.id,
      {
        date,
        description: data.description.trim(),
        category,
        type: data.type,
        amount,
        tags: data.tags ?? [],
        isCarryForward: data.isCarryForward ?? false,
      },
      { new: true },
    ).lean();

    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(doc);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectKidsDB();
    if (!mongoose.isValidObjectId(params.id)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const r = await Transaction.findByIdAndDelete(params.id);
    if (!r) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
