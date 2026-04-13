import { NextResponse } from "next/server";
import { connectKidsDB } from "@/lib/db-kids";
import { Transaction } from "@/lib/models/kids/Transaction";
import {
  transactionBodySchema,
} from "@/lib/schemas/kids-transaction";
import { normalizeCategoryFromDescription } from "@/lib/kids/normalize-category";

export const dynamic = "force-dynamic";

function coerceAmount(type: "INCOME" | "EXPENSE", amount: number): number {
  if (type === "INCOME") return Math.abs(amount);
  return -Math.abs(amount);
}

function parseDateInput(
  v: string | null | undefined,
): Date | null {
  if (v == null || v === "") return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function GET(req: Request) {
  try {
    await connectKidsDB();
    const { searchParams } = new URL(req.url);
    const typeFilter = searchParams.get("type");
    const category = searchParams.get("category");
    const year = searchParams.get("year");
    const q = searchParams.get("q")?.trim().toLowerCase() ?? "";

    const filter: Record<string, unknown> = {};
    if (typeFilter === "INCOME" || typeFilter === "EXPENSE") {
      filter.type = typeFilter;
    }
    if (category) filter.category = category;
    if (year && /^\d{4}$/.test(year)) {
      const y = parseInt(year, 10);
      filter.date = {
        $gte: new Date(`${y}-01-01T00:00:00.000Z`),
        $lte: new Date(`${y}-12-31T23:59:59.999Z`),
      };
    }

    let docs = await Transaction.find(filter).sort({ date: -1, createdAt: -1 }).lean();

    if (q) {
      docs = docs.filter(
        (d) =>
          d.description.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q),
      );
    }

    return NextResponse.json(docs);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load transactions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectKidsDB();
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

    const doc = await Transaction.create({
      date,
      description: data.description.trim(),
      category,
      type: data.type,
      amount,
      tags: data.tags ?? [],
      isCarryForward: data.isCarryForward ?? false,
    });

    return NextResponse.json(doc.toObject(), { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
}
